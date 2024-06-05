import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import moment from 'moment'
import { cookies } from 'next/headers'
import React from 'react'

function handler(arr: any, key: string) {
    let all = 0
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i].data[key]);
        all += arr[i].data[key];
    }

    return Math.ceil(all).toLocaleString("uz")
}

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
        <div className="h-screen relative bg-black overflow-auto px-3 py-5 pb-28 text-white">
            <Table className='h-full'>
                <TableHeader>
                    <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                        <TableHead className="w-[150px]">Куб</TableHead>
                        <TableHead className="w-[200px]">Номер машины</TableHead>
                        <TableHead className="w-[100px]">Цена</TableHead>
                        <TableHead>Время продажи</TableHead>
                        <TableHead>Действие</TableHead>
                        <TableHead className='text-end'>сделал</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className='radius'>
                    {
                        reports.data.data.map((i: any) => (
                            <TableRow key={i.id} className='border-none cursor-pointer'>
                                <TableCell className="rounded-l-lg">{i?.data?.volume}</TableCell>
                                <TableCell className='uppercase'>{i?.data?.autoNumber}</TableCell>
                                <TableCell>{Math.ceil(i?.data?.price).toLocaleString("uz")}</TableCell>
                                <TableCell className='flex gap-2'>
                                    <p>{moment(i?.createdAt).format('DD.MM.YY')}</p>
                                    <p>{moment(i?.createdAt).format('hh:mm')}</p>
                                </TableCell>
                                <TableCell>{i?.path}</TableCell>
                                <TableCell className='text-end rounded-r-lg'>
                                    {i?.method === 0 ? "Создал" : i?.method === 1 ? "Изменил" : "Удалил"}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <div className="fixed bottom-0 left-0 w-full bg-black">
                <Table>
                    <TableHeader>
                        <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                            <TableHead className="w-[150px]">Куб</TableHead>
                            <TableHead className="w-[200px]"></TableHead>
                            <TableHead className="w-[100px]">Цена</TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead className='text-end'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className='border-none border-t hover:bg-transparent'>
                            <TableCell className="rounded-l-lg">{handler(!reports?.data?.data[0]?.data?.volume ? reports?.data?.data.slice(1) : reports?.data?.data, "volume")}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{handler(!reports?.data?.data[0]?.data?.price ? reports?.data?.data.slice(1) : reports?.data?.data, "price")}</TableCell>
                            <TableCell></TableCell>
                            <TableCell className='flex gap-2'></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='text-end rounded-r-lg'></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default page
