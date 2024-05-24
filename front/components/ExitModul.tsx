"use client"
import React from 'react'
import { Button } from './ui/button'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

const ExitModul = ({ setAdminExit }: { setAdminExit: any }) => {
    const { push } = useRouter()
    const exit = () => {
        deleteCookie('zapAdminRole')
        deleteCookie('zapAdminToken')
        deleteCookie('zapAdminRoleId')
        deleteCookie('zapOperatorName')

        push("/log-in")
    }

    return (
        <div onClick={() => setAdminExit(false)} className='fixed top-0 left-0 h-screen w-full bg-black/30 backdrop-blur-sm z-50'>
            <div onClick={(e) => e.stopPropagation()} className="max-w-xl w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-9 rounded-lg bg-white">
                <p>Уверены?</p>
                <div className="flex items-center justify-between">
                    <Button type={"button"} onClick={() => setAdminExit(false)} className="mt-4">Назад</Button>
                    <Button type='button' variant={"destructive"} onClick={exit} className="mt-4">Выйти</Button>
                </div>
            </div>
        </div>
    )
}

export default ExitModul
