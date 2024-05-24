import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    cars: any
    reset: any
}

const CarsTable = ({ cars, reset }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                    <TableHead className="w-[100px] text-center">numbers</TableHead>
                    <TableHead className="w-[180px]">Номер машины</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead className="text-right">Имя</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='radius'>
                {
                    cars.map((i: any, idx: number) => (
                        <TableRow key={idx} onClick={() => reset({ autoNumber: i.autoNumber })} className='border-none cursor-pointer'>
                            <TableCell className="font-medium text-center rounded-l-lg">{idx + 1}</TableCell>
                            <TableCell className="font-medium">{i.autoNumber}</TableCell>
                            <TableCell>{i.batteryPercent}</TableCell>
                            <TableCell>{i.bonus}</TableCell>
                            <TableCell>{i.phoneNumber}</TableCell>
                            <TableCell className="text-right rounded-r-lg">{i.fullName}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default CarsTable
