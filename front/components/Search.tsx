"use client"
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import ExitModul from './ExitModul'
import Modal from './Modal'
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    example: string
}

const Search = ({ token, cars, role, operatorName, isPending, search, setSearch, setCloseSession }: any) => {
    const [adminExit, setAdminExit] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    useEffect(() => {
        reset({ example: search })
    }, [search])

    return (
        <>
            <div className="w-full flex items-center justify-between gap-5 pt-9 pb-5 px-4 rounded-lg bg-[#121212]">
                <p className="text-white">
                    {role}: {operatorName.value}
                </p>
                <div className="max-w-3xl w-full flex items-center gap-5">
                    <form className='max-w-3xl w-full' onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            autoComplete="off"
                            maxLength={8}
                            disabled={isPending}
                            defaultValue={search}
                            onKeyUp={(e: any) => setSearch(e.target.value)}
                            {...register("example")}
                            className={`py-5 uppercase text-xl bg-[#242424] text-white`}
                        />
                    </form>

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
            {adminExit && <ExitModul setAdminExit={setAdminExit} />}
            {openModal && <Modal setOpenModal={setOpenModal} token={token} search={search} />}
        </>
    )
}

export default Search
