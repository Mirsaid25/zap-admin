import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import moment from "moment"
import Link from "next/link"

type Props = {
    search: any
    role: any
    cars: any
    setBonus: any
    setSearch: any
    sessions: any
}

const CarsTable = ({ cars, sessions, search, role, setBonus, setSearch }: Props) => {
    return (
        <>
            {
                !search.length && role !== "admin" ?
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
                                sessions.map((i: any) => (
                                    <TableRow key={i.id} className='border-none cursor-pointer'>
                                        <TableCell className="font-medium text-center rounded-l-lg">{i.path}</TableCell>
                                        <TableCell className="font-medium uppercase">{i.data.autoNumber}</TableCell>
                                        <TableCell>{Math.ceil(i.data.price).toLocaleString("uz")}</TableCell>
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
                    :
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b hover:bg-transparent select-none border-white/20">
                                <TableHead className="w-[20px] text-center text-nowrap">
                                    №
                                </TableHead>
                                <TableHead className="w-[150px] text-nowrap">
                                    Номер машины
                                </TableHead>
                                <TableHead className="text-center text-nowrap">Status</TableHead>
                                <TableHead className="text-nowrap">Сумма бонуса</TableHead>
                                <TableHead className="text-nowrap">Номер</TableHead>
                                <TableHead className="text-right text-nowrap">
                                    Имя
                                </TableHead>
                                <TableHead className="text-right text-nowrap">
                                    История
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="radius">
                            {cars.map((i: any, idx: number) => (
                                <TableRow
                                    key={idx}
                                    onClick={() => { 
                                        setBonus(i.bonus) 
                                        setSearch(i.autoNumber) 
                                    }}
                                    className={`border-none cursor-pointer ${search.toLocaleUpperCase() === i.autoNumber ? "bg-[#828486]" : ""}`}
                                >
                                    <TableCell className="font-medium text-center rounded-l-lg text-nowrap">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium uppercase text-nowrap">
                                        {i.autoNumber}
                                    </TableCell>
                                    <TableCell className="text-center text-nowrap">
                                        {i.batteryPercent}
                                    </TableCell>
                                    <TableCell className="text-nowrap">{Math.ceil(i.bonus).toLocaleString("uz")} сум</TableCell>
                                    <TableCell className="text-nowrap">{i.phoneNumber}</TableCell>
                                    <TableCell className="text-right text-nowrap">
                                        {i.fullName}
                                    </TableCell>
                                    <TableCell className="text-right rounded-r-lg text-nowrap">
                                        <Link
                                            href={`/${i._id}`}
                                            type="button"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            открыть
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }
        </>
    )
}

export default CarsTable
