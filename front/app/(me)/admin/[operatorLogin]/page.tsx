import axios from 'axios'
import moment from 'moment'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PaginationCom from '@/components/PaginationCom'

const page = async ({ searchParams, params: { operatorLogin } }: { params: { operatorLogin: string }, searchParams: any }) => {
    const token = cookies().get("zapAdminToke")?.value
    const sessions = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sessions?operator.login=${operatorLogin}`, { headers: { Authorization: token }, params: { $skip: 20 * (searchParams.page - 1), $sort: { createdAt: -1 } } })
    const pgn = searchParams['page'] ?? 0

    return (
        <div className="h-screen bg-black overflow-auto px-3 py-5 text-white">
            <p className='ml-4 mb-5'>Operator: {operatorLogin}</p>
            <Table>
                <TableHeader>
                    <TableRow className='border-b hover:bg-transparent select-none border-black/20'>
                        <TableHead className="w-[180px]">Время старта</TableHead>
                        <TableHead>Посмотреть</TableHead>
                        <TableHead>Время выхода</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='radius'>
                    {
                        sessions.data.data.map((i: any) => (
                            <TableRow key={i.id} className='border-none cursor-pointer rounded-r-lg'>
                                <TableCell className='rounded-l-lg flex gap-2'>
                                    <p>{moment(i.createdAt).format('DD.MM.YY')}</p>
                                    <p>{moment(i.createdAt).format('HH:mm')}</p>
                                </TableCell>
                                <TableCell className=''>
                                    <Link href={{
                                        pathname: `/admin/${operatorLogin}/${i._id}`,
                                        query: { createdAt: i.createdAt, updatedAt: i.updatedAt }
                                    }}>Посмотреть</Link>
                                </TableCell>
                                <TableCell className='flex gap-2 rounded-r-lg'>
                                    <p>{moment(i.updatedAt).format('DD.MM.YY')}</p>
                                    <p>{moment(i.updatedAt).format('HH:mm')}</p>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <PaginationCom sessions={sessions.data.total} searchParams={searchParams} />
        </div>
    )
}

export default page