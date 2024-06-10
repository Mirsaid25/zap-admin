"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Modal from "@/components/Modal";
import axios from "axios";
import ModalSession from "./ModalSession";
import ExitModul from "./ExitModul";
import CarsTable from "./CarsTable";
import FormPanel from "./FormPanel";
import Search from "./Search";

type Inputs = {
    autoNumber: string;
    column: string;
    volume: string;
    price: string;
    isTaxi: string;
};

const Form = ({ token, role, operatorName, config, createdAt, operatorLogin }: any) => {
    const [cars, setCars] = useState<any>([]);
    const [sessions, setSessions] = useState<any>([]);
    const [isPending, setIsPending] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [bonus, setBonus] = useState(0);
    const [changeKub, setChangeKub] = useState<number>();
    const [closeSession, setCloseSession] = useState(false);
    const [handleUpdata, setHandleUpdata] = useState(false);

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

    return (
        <div className="px-3 h-screen pt-3 pb-5 w-full flex flex-col bg-black">
            <div className="flex flex-col h-full">
                <Search
                    token={token}
                    cars={cars}
                    role={role}
                    operatorName={operatorName}
                    isPending={isPending}
                    search={search}
                    setSearch={setSearch}
                    setCloseSession={setCloseSession}
                />

                <ResizablePanelGroup
                    direction="horizontal"
                    className="mt-3 text-white"
                >
                    <ResizablePanel className="scroll h-full rounded-lg mr-4 p-5 pt-3 bg-[#121212]">
                        <CarsTable
                            search={search}
                            role={role}
                            cars={cars}
                            setBonus={setBonus}
                            setSearch={setSearch}
                            sessions={sessions}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35} className="h-full ml-4">
                        <FormPanel
                            search={search}
                            token={token}
                            setSearch={setSearch}
                            setIsPending={setIsPending}
                            role={role}
                            config={config}
                            isPending={isPending}
                            changeKub={changeKub}
                            bonus={bonus}
                            setChangeKub={setChangeKub}
                            setBonus={setBonus}
                            setHandleUpdata={setHandleUpdata}
                            handleUpdata={handleUpdata}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            {closeSession && <ModalSession setCloseSession={setCloseSession} />}
        </div>
    );
};

export default Form;
