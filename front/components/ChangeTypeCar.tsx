"use client"
import { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import action from '@/app/action';

const ChangeTypeCar = ({ type, token, id }: any) => {
    const [typeCar, setTypeCar] = useState<number>(type);

    const onChangeType = () => {
        axios(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            data: {
                type: +typeCar
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                action("/cars")
            }
        })
    }

    return (
        <div className='flex items-center'>
            <input type="text" defaultValue={typeCar} onChange={(e: any) => setTypeCar(e.target.value)} className="bg-transparent border-b" />
            <Button onClick={onChangeType} className='h-[22px] bg-transparent hover:bg-transparent rounded-none border-b border-white'>Сохранить</Button>
        </div>
    )
}

export default ChangeTypeCar
