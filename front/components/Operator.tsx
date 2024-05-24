"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import moment from "moment"
import axios from "axios"

const Operator = ({ operator, token }: { operator: any, token: string }) => {
    const deleteOperator = (id: string) => {
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/operators/${id}`, { headers: { Authorization: token } })
    }

    return (
        <div key={operator._id} className="bg-[#09090b] border border-[#27272a] rounded-xl px-6 py-4">
            <div className="flex items-center justify-between">
                <p className='text-lg'>{operator.fullName}</p>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/${operator.login}`} className="bg-[#0f172a] hover:bg-[#15213a] py-2 px-4 rounded-lg duration-150 ease-in">открыть</Link>
                    <Button onClick={() => deleteOperator(operator._id)} variant="destructive">Удалить</Button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <p className='text-base text-gray-500'>от {moment(operator.createdAt).format('MM.HH.DD')}</p>
                    <p className='text-base text-gray-500'>{moment(operator.createdAt).format('MM.YY')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className='text-base text-gray-500'>до {moment(operator.updatedAt).format('MM.HH.DD')}</p>
                    <p className='text-base text-gray-500'>{moment(operator.updatedAt).format('MM.YY')}</p>
                </div>
            </div>
        </div>
    )
}

export default Operator
