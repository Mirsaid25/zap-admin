"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Modal from '@/components/Modal';
import axios from 'axios';
import Link from 'next/link';
import ModalSession from './ModalSession';
import ExitModul from './ExitModul';

type Inputs = {
    autoNumber: string;
    column: string
    volume: string
    price: string
    isTaxi: string
};

const formSchema = z.object({
    volume: z.string(),
    price: z.string(),
    autoNumber: z.string().min(8).max(8),
    column: z.string(),
    isTaxi: z.string()
})

const Form = ({ token, role, operatorName, config }: any) => {
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<Inputs>();
    const [isPending, setIsPending] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cars, setCars] = useState<any>([]);
    const [search, setSearch] = useState<string>("");
    const [bonus, setBonus] = useState(0);
    const [changeKub, setChangeKub] = useState(0);
    const [changePrice, setChangePrice] = useState(0);
    const [payWithBonus, setPayWithBonus] = useState(false);
    const [closeSession, setCloseSession] = useState(false);
    const [adminExit, setAdminExit] = useState(false);

    const bon = changeKub && bonus !== 0 ? bonus > changePrice ? changePrice : bonus : "0"
    const nal = changePrice > bonus ? changePrice - bonus : ""

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true)
        const sendData = {
            ...data,
            autoNumber: data.autoNumber.toUpperCase(),
            volume: Number(data.volume),
            column: Number(data.column),
            price: changePrice,
            isTaxi: data.isTaxi === "1",
            useBonus: payWithBonus
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, sendData, {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setSearch("")
                reset()
                reset({
                    autoNumber: ""
                })
                setChangeKub(0)
                setChangePrice(0)
                setBonus(0)
                setIsPending(false)
            }
        })
    };

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`,
            {
                headers: {
                    Authorization: token
                },
                params: {
                    autoNumber: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            }
        ).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setCars(res.data.data);
                console.log(res);
            }
        })
    }, [search])

    function changeKubFn(v: number) {
        setChangeKub(v)
        setChangePrice((v * config.price))
    }

    return (
        <div className="px-3 h-screen pt-3 pb-5 w-full flex flex-col bg-black">
            {
                openModal && (
                    <Modal setOpenModal={setOpenModal} token={token} />
                )
            }
            {
                closeSession && (
                    <ModalSession setCloseSession={setCloseSession} />
                )
            }
            {
                adminExit && (
                    <ExitModul setAdminExit={setAdminExit} />
                )
            }
            <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full flex items-center justify-between gap-5 pt-9 pb-5 px-4 rounded-lg bg-[#121212]">
                    <p className="text-white">
                        {
                            role
                        }:
                        {
                            operatorName.value
                        }
                    </p>
                    <div className="max-w-3xl w-full flex items-center gap-5">
                        <Input
                            autoComplete='off'
                            maxLength={8}
                            disabled={isPending}
                            onKeyUp={(e: any) => setSearch(e.target.value)}
                            className={`py-5 uppercase text-xl bg-[#242424] text-white ${errors.autoNumber && "border border-[red] outline-[red]"}`}
                            {...register("autoNumber", { required: true })}
                        />
                        {
                            !cars[0] ?
                                <Button
                                    onClick={() => setOpenModal(true)}
                                    type='button'
                                    className="bg-green-700 hover:bg-green-600 text-2xl h-11"
                                >+</Button>
                                :
                                null
                        }
                    </div>
                    <div className="text-white text-sm">
                        {
                            role === "operator"
                                ? <Button type='button' onClick={() => setCloseSession(true)}>Завершить сессию</Button>
                                :
                                <div className='flex items-center gap-3'>
                                    <Link href={"/admin"} className="bg-[#0f172a] hover:bg-[#15213a] py-2 px-4 rounded-lg duration-150 ease-in">super admin</Link>
                                    <Button type='button' onClick={() => setAdminExit(true)} variant={'destructive'} className='h-fit'>Выйти</Button>
                                </div>
                        }
                    </div>
                </div>

                <ResizablePanelGroup direction="vertical" className="mt-3 text-white">
                    <ResizablePanel className='scroll h-fit p-4 mb-4 rounded-lg bg-[#121212]'>
                        <Table>
                            <TableHeader>
                                <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                                    <TableHead className="w-[100px] text-center">numbers</TableHead>
                                    <TableHead className="w-[180px]">Номер машины</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Сумма бонуса</TableHead>
                                    <TableHead>Номер</TableHead>
                                    <TableHead className="text-right">Имя</TableHead>
                                    <TableHead className="text-right">История</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='radius'>
                                {
                                    cars.map((i: any, idx: number) => (
                                        <TableRow key={idx} onClick={() => { reset({ autoNumber: i.autoNumber }), setBonus(i.bonus) }} className='border-none cursor-pointer'>
                                            <TableCell className="font-medium text-center rounded-l-lg">{idx + 1}</TableCell>
                                            <TableCell className="font-medium uppercase">{i.autoNumber}</TableCell>
                                            <TableCell>{i.batteryPercent}</TableCell>
                                            <TableCell>{i.bonus}</TableCell>
                                            <TableCell>{i.phoneNumber}</TableCell>
                                            <TableCell className="text-right">{i.fullName}</TableCell>
                                            <TableCell className="text-right rounded-r-lg"><Link href={`/${i._id}`} type='button' onClick={(e) => e.stopPropagation()}>открыть</Link></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className='h-full pb-8 px-5 mt-4 rounded-lg bg-[#121212]'>
                        <div className="h-full grid grid-cols-3 gap-5 mt-5">
                            <ul className="grid grid-cols-2 gap-2">
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7].map((i: number) => (
                                        <li key={i}>
                                            <label className={`radio-btn cursor-pointer ${errors.column && "animate-pulse"}`}>
                                                <input disabled={isPending} type="radio" {...register("column", { required: true })} name="column" value={i + 1} className="hidden-radio" />
                                                <span>{i + 1}</span>
                                            </label>
                                        </li>
                                    ))
                                }
                            </ul>
                            <div className="grid grid-cols-1 gap-2">
                                <label className={`radio-btn cursor-pointer ${errors.isTaxi && "animate-pulse"}`}>
                                    <input disabled={isPending} value={"1"} type="radio" {...register("isTaxi", { required: true })} className={`hidden-radio ${errors.isTaxi && "animate-pulse"}`} />
                                    <span>Такси</span>
                                </label>
                                <label className={`radio-btn cursor-pointer ${errors.isTaxi && "animate-pulse"}`}>
                                    <input disabled={isPending} value={"1"} type="radio" {...register("isTaxi", { required: true })} className={`hidden-radio ${errors.isTaxi && "animate-pulse"}`} />
                                    <span>Грузовые</span>
                                </label>
                                <label className={`radio-btn cursor-pointer ${errors.isTaxi && "animate-pulse"}`}>
                                    <input disabled={isPending} value={"0"} type="radio" {...register("isTaxi", { required: true })} className={`hidden-radio ${errors.isTaxi && "animate-pulse"}`} />
                                    <span>Обычная</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-2 h-[55%]">
                                    <Input
                                        type="number"
                                        onKeyUpCapture={(e: any) => changeKubFn(+e.target.value)}
                                        {...register("volume", { required: true })}
                                        className={`w-full h-full text-2xl px-5 bg-[#242424] text-white ${errors.price && "border-[red] outline-[red]"}`}
                                        placeholder="Kub"
                                        disabled={isPending}
                                        defaultValue={changeKub}
                                    />

                                    <Input
                                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                        type="text"
                                        value={config.price}
                                        placeholder="Sum"
                                    />

                                    <Input
                                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                        type="number"
                                        disabled={isPending}
                                        {...register("price", { required: true })}
                                        placeholder="Sum"
                                        value={changePrice}
                                    />
                                </div>
                                <div className="h-fit w-full mt-5">
                                    <p>bonus: {bonus}</p>
                                    <div className="grid grid-cols-2 gap-3 h-fit items-center justify-between mt-2">
                                        <Button disabled={isPending} onClick={() => setPayWithBonus(false)} type='submit' className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-1">{changePrice.toLocaleString()} налом</Button>
                                        <Button disabled={isPending || bonus == 0} onClick={() => setPayWithBonus(true)} type='submit' className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2 flex flex-col items-start">
                                            <p>
                                                {bon.toLocaleString()} с бонуса
                                            </p>
                                            <p>
                                                {nal.toLocaleString()} {changePrice > bonus ? "нал" : ""}
                                            </p>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </form>
        </div>
    )
}

export default Form
