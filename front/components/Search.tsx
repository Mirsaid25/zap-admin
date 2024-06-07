import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'

const Search = ({ cars, role, operatorName, isPending, search, setSearch, errors, register, setOpenModal, setCloseSession, setAdminExit }: any) => {
    return (
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
    )
}

export default Search
