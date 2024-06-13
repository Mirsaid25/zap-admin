import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios"
import { cookies } from "next/headers";
import moment from 'moment';
import { getData } from "@/lib/https";
import ChangeTypeCar from "@/components/ChangeTypeCar";

const page = async ({ params: { id } }: { params: { id: string } }) => {
    const token = cookies().get("userToken")?.value
    const config = await getData("/config")
    const car = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
        headers: {
            Authorization: token,
        },
        params: {
            autoNumber: {
                $regex: id,
                $options: "i",
            },
        },
    })
    console.log(car.data.data);

    return (
        <div className="w-full min-h-screen px-3 pt-5 text-white bg-black">
            <Table>
                <TableHeader>
                    <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                        <TableHead className="w-[180px]">Номер машины</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Сумма бонуса</TableHead>
                        <TableHead>Номер водителя</TableHead>
                        <TableHead className="text-right">Имя водителя</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='radius'>
                    <TableRow className='border-none hover:bg-transparent'>
                        <TableCell className="font-medium uppercase rounded-l-lg">{car.data.data[0].autoNumber}</TableCell>
                        <TableCell>
                            <ChangeTypeCar type={car.data.data[0].type} token={token} id={car.data.data[0]._id} />
                        </TableCell>
                        <TableCell>{car.data.data[0].bonus.toLocaleString("uz")}</TableCell>
                        <TableCell>{car.data.data[0].phoneNumber}</TableCell>
                        <TableCell className="text-right rounded-r-lg">{car.data.data[0].fullName}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Table className="mt-10">
                <TableHeader>
                    <TableRow className='border-b hover:bg-transparent select-none border-white/20'>
                        <TableHead className="text-nowrap w-[180px]">Дата</TableHead>
                        <TableHead className="text-nowrap">Метр куб</TableHead>
                        <TableHead className="text-nowrap">Цена</TableHead>
                        <TableHead className="text-nowrap">Сумма</TableHead>
                        <TableHead className="text-nowrap">Размер бонуса %</TableHead>
                        <TableHead className="text-nowrap">Сумма бонуса</TableHead>
                        <TableHead className="text-nowrap">Общие бонусы</TableHead>
                        <TableHead className="text-nowrap">Уровень</TableHead>
                        <TableHead className="text-nowrap text-right">Покупка за последние {config.data[0].days} дней</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='radius'>
                    {
                        car.data.data[0].history.reverse().map((el: any) => (
                            <TableRow key={el._id} className='border-none cursor-pointer'>
                                <TableCell className="font-medium rounded-l-lg">{moment(el.createdAt).format('DD.MM.YY')}</TableCell>
                                <TableCell>{el.volume}</TableCell>
                                <TableCell>{el.volumePrice.toLocaleString("uz")}</TableCell>
                                <TableCell>{el.price.toLocaleString("uz")}</TableCell>
                                <TableCell>{el.bonusPercent.toLocaleString("uz")}</TableCell>
                                <TableCell>{el.bonusPricePerPurchase.toLocaleString("uz")}</TableCell>
                                <TableCell>{el.bonusPrice.toLocaleString("uz")}</TableCell>
                                <TableCell>{el.bonusPercent == 5 ? "Золото" : el.bonusPercent == 3 ? "Серебро" : "Бронза"}</TableCell>
                                <TableCell className="text-right rounded-r-lg">{el.allVolume}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default page
