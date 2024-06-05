"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Modal from "@/components/Modal";
import axios from "axios";
import Link from "next/link";
import ModalSession from "./ModalSession";
import ExitModul from "./ExitModul";
import action from "@/actions/action";

type Inputs = {
    autoNumber: string;
    column: string;
    volume: string;
    price: string;
    isTaxi: string;
};

const formSchema = z.object({
    price: z.string(),
    autoNumber: z.string().min(8).max(8),
    isTaxi: z.string(),
});

const Form = ({ token, role, operatorName, config }: any) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();
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
    const [handleUpdata, setHandleUpdata] = useState(false);
    const [mKub, setMKub] = useState(config.price);
    const [carNumber, setCarNumber] = useState("");
    console.log(search);

    const nal = changePrice > bonus ? changePrice - bonus : changePrice;

    const handleClick = () => {
        console.log(mKub, "kub");
        // axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/config`, { price: mKub }, { headers: { Authorization: token } })
        //     .then((res) => console.log(res.data))

        axios(`${process.env.NEXT_PUBLIC_API_URL}/config/${config._id}`, {
            method: 'PATCH',
            headers: {
                Authorization: token, // Предполагается использование Bearer токена
                'Content-Type': 'application/json', // Если отправляете JSON данные
            },
            data: {
                price: mKub
            },
        })
    }

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true);
        const sendData = {
            ...data,
            autoNumber: data.autoNumber.toUpperCase(),
            price: changePrice,
            isTaxi: data.isTaxi === "1",
            useBonus: payWithBonus,
        };

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, sendData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setSearch("");
                    reset();
                    reset({
                        autoNumber: "",
                    });
                    setChangeKub(0);
                    setChangePrice(0);
                    setBonus(0);
                    setIsPending(false);
                    setHandleUpdata(!handleUpdata)
                }
            });
    }

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
                headers: {
                    Authorization: token,
                },
                params: {
                    autoNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
            })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setCars(res.data.data);
                    console.log(res);
                }
            });
    }, [search, handleUpdata]);

    function changeKubFn(v: number) {
        setChangeKub(v);
        setChangePrice(v * config.price);
    }

    return (
        <div className="px-3 h-screen pt-3 pb-5 w-full flex flex-col bg-black">
            {openModal && <Modal setOpenModal={setOpenModal} token={token} search={search} />}
            {closeSession && <ModalSession setCloseSession={setCloseSession} />}
            {adminExit && <ExitModul setAdminExit={setAdminExit} />}
            <form
                className="flex flex-col h-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full flex items-center justify-between gap-5 pt-9 pb-5 px-4 rounded-lg bg-[#121212]">
                    <p className="text-white">
                        {role}:{operatorName.value}
                    </p>
                    <div className="max-w-3xl w-full flex items-center gap-5">
                        <Input
                            autoComplete="off"
                            maxLength={8}
                            disabled={isPending}
                            defaultValue={search}
                            onKeyUp={(e: any) => setSearch(e.target.value)}
                            className={`py-5 uppercase text-xl bg-[#242424] text-white ${errors.autoNumber &&
                                "border border-[red] outline-[red]"
                                }`}
                            {...register("autoNumber", { required: true })}
                        />
                        {!cars[0] ? (
                            <Button
                                onClick={() => setOpenModal(true)}
                                type="button"
                                className="bg-green-700 hover:bg-green-600 text-2xl h-11"
                            >
                                +
                            </Button>
                        ) : null}
                    </div>
                    <div className="text-white text-sm">
                        {role === "operator" ? (
                            <Button
                                type="button"
                                onClick={() => setCloseSession(true)}
                            >
                                Завершить сессию
                            </Button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={"/admin"}
                                    className="bg-[#0f172a] hover:bg-[#15213a] py-2 px-4 rounded-lg duration-150 ease-in"
                                >
                                    Отчеты
                                </Link>
                                <Button
                                    type="button"
                                    onClick={() => setAdminExit(true)}
                                    variant={"destructive"}
                                    className="h-fit"
                                >
                                    Выйти
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <ResizablePanelGroup
                    direction="horizontal"
                    className="mt-3 text-white"
                >
                    <ResizablePanel className="scroll h-full rounded-lg mr-4 bg-[#121212]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b hover:bg-transparent select-none border-white/20">
                                    <TableHead className="w-[40px] text-center text-nowrap">
                                        numbers
                                    </TableHead>
                                    <TableHead className="w-[150px] text-nowrap">
                                        Номер машины
                                    </TableHead>
                                    <TableHead className="text-center text-nowrap">Status</TableHead>
                                    <TableHead className="text-nowrap">Сумма бонуса</TableHead>
                                    <TableHead className="text-nowrap">Номер</TableHead>
                                    <TableHead className="text-right text-nowrap">
                                        Имя
                                    </TableHead>
                                    <TableHead className="text-right text-nowrap">
                                        История
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="radius">
                                {cars.map((i: any, idx: number) => (
                                    <TableRow
                                        key={idx}
                                        onClick={() => {
                                            reset({ autoNumber: i.autoNumber }),
                                                setBonus(i.bonus),
                                                setCarNumber(i.autoNumber),
                                                setSearch(i.autoNumber)
                                        }}
                                        className={`border-none cursor-pointer ${search.toLocaleUpperCase() === i.autoNumber ? "bg-[#828486]" : ""}`}
                                    >
                                        <TableCell className="font-medium text-center rounded-l-lg text-nowrap">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="font-medium uppercase text-nowrap">
                                            {i.autoNumber}
                                        </TableCell>
                                        <TableCell className="text-center text-nowrap">
                                            {i.batteryPercent}
                                        </TableCell>
                                        <TableCell className="text-nowrap">{Math.ceil(i.bonus).toLocaleString("uz")}</TableCell>
                                        <TableCell className="text-nowrap">{i.phoneNumber}</TableCell>
                                        <TableCell className="text-right text-nowrap">
                                            {i.fullName}
                                        </TableCell>
                                        <TableCell className="text-right rounded-r-lg text-nowrap">
                                            <Link
                                                href={`/${i._id}`}
                                                type="button"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                открыть
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35} className="h-full rounded-lg ml-4 bg-[#121212]">
                        <div className="h-full p-5">
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="number"
                                        onKeyUpCapture={(e: any) =>
                                            changeKubFn(+e.target.value)
                                        }
                                        {...register("volume", {
                                            required: true,
                                        })}
                                        className={`w-full h-full text-2xl px-5 bg-[#242424] text-white ${errors.price &&
                                            "border-[red] outline-[red]"
                                            }`}
                                        placeholder="Kub"
                                        disabled={isPending}
                                        defaultValue={changeKub}
                                    />

                                    <div className="relative">
                                        {
                                            role === "admin" ?
                                                <Input
                                                    className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                                    type="text"
                                                    onChange={(e) => setMKub(+e.target.value)}
                                                    defaultValue={config.price}
                                                    placeholder="Sum"
                                                />
                                                :
                                                <Input
                                                    className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                                    type="text"
                                                    value={config.price}
                                                    placeholder="Sum"
                                                />
                                        }
                                        {
                                            role === "admin" ?
                                                <Button onClick={handleClick} type="button" className="absolute top-[3px] right-1 text-sm py-0.5 px-2 bg-green-700 hover:bg-green-600">Сохранить</Button>
                                                : null
                                        }
                                    </div>

                                    <Input
                                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                        type="number"
                                        disabled={isPending}
                                        {...register("price", {
                                            required: true,
                                        })}
                                        placeholder="Sum"
                                        value={Math.ceil(changePrice)}
                                    />
                                </div>
                                <div className="h-fit w-full mt-5">
                                    <p>bonus: {Math.ceil(bonus).toLocaleString('uz')}</p>
                                    <div className="grid grid-cols-1 gap-3 h-fit items-center justify-between mt-2">
                                        <Button
                                            disabled={isPending}
                                            onClick={() =>
                                                setPayWithBonus(false)
                                            }
                                            type="submit"
                                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-1"
                                        >
                                            {Math.ceil(changePrice).toLocaleString("uz")} cум
                                        </Button>
                                        <Button
                                            disabled={isPending || bonus == 0}
                                            onClick={() =>
                                                setPayWithBonus(true)
                                            }
                                            type="submit"
                                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2 flex flex-col items-center"
                                        >
                                            <p className="text-center">
                                                {Math.ceil(nal).toLocaleString("uz")} сум
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
    );
};

export default Form;
