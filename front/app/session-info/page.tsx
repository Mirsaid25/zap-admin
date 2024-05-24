"use client"

import { deleteAllCookies } from "@/actions/action"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { deleteCookie, getCookie } from "cookies-next"
import moment from "moment"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
    const operatorLogin = getCookie("operatorLogin")
    const createdAt = getCookie("createdAt")
    const updatedAt = getCookie("updatedAt")
    const token: any = getCookie("zapAdminToken");

    const { push } = useRouter()


    const [info, setInfo] = useState<any>()

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports?operator.login=${operatorLogin}&createdAt[$gte]=${createdAt}&updatedAt[$lt]=${updatedAt}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            if (res.status === 201 || res.status === 200) {
                setInfo(res.data)
                deleteAllCookies()
                
            }
        }).catch(err => {
            push("log-in")
        })
    }, [])


    if (!info) {
        return null
    }


    return (
        <div className='h-screen w-full z-50'>
            <div className="w-full px-8 py-9 rounded-lg">
                {/* <ul className="mb-5 pb-2 border-b">
                    <li className="flex items-center justify-between">
                        <p>Что он сделал</p>
                        <p>{info.data[0].path}</p>
                    </li>
                    <li className="flex items-center justify-between">
                        <p>Когда начал</p>
                        <div className="flex items-center gap-2">
                            <p>{moment(info.data[0].operator.createdAt).format('MM.HH.DD')}</p>
                            <p>{moment(info.data[0].operator.createdAt).format('MM.YY')}</p>
                        </div>
                    </li>
                    <li className="flex items-center justify-between">
                        <p>Когда закончил</p>
                        <div className="flex items-center gap-2">
                            <p>{moment(info.data[0].operator.updatedAt).format('MM.HH.DD')}</p>
                            <p>{moment(info.data[0].operator.updatedAt).format('MM.YY')}</p>
                        </div>
                    </li>
                </ul> */}

                <Table>
                    <TableHeader>
                        <TableRow className='border-b hover:bg-transparent select-none border-black/20'>
                            <TableHead className="w-[100px] text-center">Действие</TableHead>
                            <TableHead className="w-[180px]">Номер машины</TableHead>
                            <TableHead>Колонка</TableHead>
                            <TableHead>Сумма продажи</TableHead>
                            <TableHead>Куб</TableHead>
                            <TableHead className="text-right">Время продажи</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='radius'>
                        {
                            info.data.map((i: any) => (
                                <TableRow key={i.id} className='border-none cursor-pointer'>
                                    <TableCell className="font-medium text-center rounded-l-lg">{i.path}</TableCell>
                                    <TableCell className="font-medium uppercase">{i.data.autoNumber}</TableCell>
                                    <TableCell>{i.data.column}</TableCell>
                                    <TableCell>{i.data.price}</TableCell>
                                    <TableCell>{i.data.volume}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <p>{moment(i.createdAt).format('DD.MM.YY')}</p>
                                        <p>{moment(i.createdAt).format('HH.MM')}</p>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Page
