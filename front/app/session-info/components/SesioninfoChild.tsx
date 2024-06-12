"use client"

import moment from "moment"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCookie } from "cookies-next"

interface SesionInfoChildProps {
    res: any
}

const SesionInfoChild: React.FunctionComponent<SesionInfoChildProps> = ({ res }) => {
    useEffect(() => {
        deleteCookie("operatorLogin")
        deleteCookie("createdAt")
        deleteCookie("updatedAt")
        deleteCookie("zapAdminToken")
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableRow className='border-b hover:bg-transparent select-none border-black/20'>
                    <TableHead className="w-[100px] text-center">Действие</TableHead>
                    <TableHead className="w-[180px]">Номер машины</TableHead>
                    <TableHead>Сумма продажи</TableHead>
                    <TableHead>Куб</TableHead>
                    <TableHead className="text-right">Время продажи</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='radius'>
                {
                    res &&
                    res.data.map((i: any, idx: number) => (
                        <TableRow key={idx} className='border-none cursor-pointer'>
                            <TableCell className="font-medium text-center rounded-l-lg">{i.path}</TableCell>
                            <TableCell className="font-medium uppercase">{i.data.autoNumber}</TableCell>
                            <TableCell>{i.data.price ? Math.ceil(i.data.price).toLocaleString("uz") : ""}</TableCell>
                            <TableCell>{i.data.volume}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                <p>{moment(i.createdAt).format('DD.MM.YY')}</p>
                                <p>{moment(i.createdAt).format('HH:mm')}</p>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}

export default SesionInfoChild;