import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import moment from 'moment'
import { cookies } from 'next/headers'
import React from 'react'

const page = async ({ params: { operatorLogin }, searchParams: { createdAt, updatedAt } }: { params: { operatorLogin: string }, searchParams: { createdAt: string, updatedAt: string } }) => {
    const token = cookies().get("zapAdminToken")?.value
    const reports = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        headers: { Authorization: token },
        params: {
            "operator.login": operatorLogin,
            createdAt: { $gte: createdAt, $lt: updatedAt }
        }
    })

    console.log(reports.data.data);

    return (
        <div className="h-screen bg-black overflow-auto px-3 py-5 text-white">
            <Table>
                <TableHeader>
                    <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                        <TableHead className="w-[100px]">Куб</TableHead>
                        <TableHead className="w-[200px]">Номер машины</TableHead>
                        <TableHead className="w-[100px]">Цена</TableHead>
                        <TableHead>Колонка</TableHead>
                        <TableHead>Время продажи</TableHead>
                        <TableHead>сделал</TableHead>
                        <TableHead className='text-end'>сделал</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='radius'>
                    {
                        reports.data.data.map((i: any) => (
                            <TableRow key={i.id} className='border-none cursor-pointer'>
                                <TableCell className="rounded-l-lg">{i.data.volume}</TableCell>
                                <TableCell>{i.data.autoNumber}</TableCell>
                                <TableCell>{i.data.price}</TableCell>
                                <TableCell>{i.data.column}</TableCell>
                                <TableCell className='flex gap-2'>
                                    <p>{moment(i.createdAt).format('DD.MM.YY')}</p>
                                    <p>{moment(i.createdAt).format('HH.MM')}</p>
                                </TableCell>
                                <TableCell>{i.path}</TableCell>
                                <TableCell className='text-end rounded-r-lg'>
                                    {i.method === 0 ? "Создал" : i.method === 1 ? "Изменил" : "Удалил"}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default page
