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
import moment, { now } from "moment";
import CarsTable from "./CarsTable";
import FormPanel from "./FormPanel";

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

const Form = ({ token, role, operatorName, config, createdAt, operatorLogin }: any) => {
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
    const [days, setDays] = useState(config.days);
    const [sessions, setSessions] = useState<any>([]);
    const [settingsPennding, setSettingsPennding] = useState(false);
    const nal = changePrice > bonus ? changePrice - bonus : changePrice;

    const settings = () => {
        setSettingsPennding(true)
        axios(`${process.env.NEXT_PUBLIC_API_URL}/config/${config._id}`, {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            data: {
                price: mKub,
                days: days
            },
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setSettingsPennding(false)
            }
        })
    }

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true);
        const sendData = {
            ...data,
            autoNumber: data.autoNumber.toUpperCase(),
            column: 1,
            type: 1,
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
                    setBonus(0)
                    setIsPending(false)
                    setHandleUpdata(!handleUpdata)
                }
            });
    }

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
            headers: {
                Authorization: token,
            },
            params: {
                autoNumber: {
                    $regex: search,
                    $options: "i",
                },
            },
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setCars(res.data.data);
            }
        });
    }, [search, handleUpdata]);

    useEffect(() => {
        const updatedAt = new Date().toISOString();
        if (role !== "admin") {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports?operator.login=${operatorLogin}&createdAt[$gte]=${createdAt}&updatedAt[$lt]=${updatedAt}`, {
                headers: {
                    Authorization: token
                }
            }).then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setSessions(res.data.data)
                }
            })
        } else {
            setSessions([])
        }
    }, [search])

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
                        {role}: {operatorName.value}
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
                    <ResizablePanel className="scroll h-full rounded-lg mr-4 p-5 pt-3 bg-[#121212]">
                        <CarsTable
                            search={search}
                            role={role}
                            reset={reset}
                            cars={cars}
                            setBonus={setBonus}
                            setSearch={setSearch}
                            sessions={sessions}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35} className="h-full ml-4">
                        <FormPanel
                            nal={nal}
                            role={role}
                            setDays={setDays}
                            setMKub={setMKub}
                            config={config}
                            settings={settings}
                            settingsPennding={settingsPennding}
                            changeKubFn={changeKubFn}
                            errors={errors}
                            register={register}
                            isPending={isPending}
                            changeKub={changeKub}
                            changePrice={changePrice}
                            bonus={bonus}
                            setPayWithBonus={setPayWithBonus}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </form>
        </div>
    );
};

export default Form;
