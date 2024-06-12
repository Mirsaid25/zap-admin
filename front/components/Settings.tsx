"use client"
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { z } from 'zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import action from '@/app/action';

type InputsSettings = {
    price: number
    days: number
    firstValue: any
    secondValue: any
    thirdValue: any
};

const formSettings = z.object({
    price: z.number(),
    days: z.number(),
    firstValue: z.any(),
    secondValue: z.any(),
    thirdValue: z.any(),
});

const Settings = ({ config, token }: any) => {    
    const [settingsPennding, setSettingsPennding] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InputsSettings>();

    function onSubmit(data: z.infer<typeof formSettings>) {
        setSettingsPennding(true)
        axios(`${process.env.NEXT_PUBLIC_API_URL}/config/${config._id}`, {
            method: 'PATCH',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
            data
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setSettingsPennding(false)
                action("/config")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full mt-5 p-5 rounded-lg bg-[#121212]">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium">Настройки</h2>
                <label>
                    <p className="text-lg mb-1">День</p>
                    <Input
                        type="number"
                        defaultValue={+config.days}
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        {...register("days", {
                            required: true,
                        })}
                    />
                </label>
                <label>
                    <p className="text-lg mb-1">М Куб</p>
                    <Input
                        type="number"
                        defaultValue={+config.price}
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        {...register("price", {
                            required: true,
                        })}
                    />
                </label>
                <div className="flex items-centers gap-3">
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Значение</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.firstValue.value}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("firstValue.value", {
                                required: true,
                            })}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Працент</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.firstValue.percent}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("firstValue.percent", {
                                required: true,
                            })}
                        />
                    </div>
                </div>
                <div className="flex items-centers gap-3">
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Значение</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.secondValue.value}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("secondValue.value", {
                                required: true,
                            })}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Працент</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.secondValue.percent}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("secondValue.percent", {
                                required: true,
                            })}
                        />
                    </div>
                </div>
                <div className="flex items-centers gap-3">
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Значение</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.thirdValue.value}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("thirdValue.value", {
                                required: true,
                            })}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <label htmlFor="value1" className='w-full'>
                            <p className="text-lg mb-1">Працент</p>
                        </label>
                        <Input
                            id='value1'
                            type="number"
                            defaultValue={config.thirdValue.percent}
                            className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                            {...register("thirdValue.percent", {
                                required: true,
                            })}
                        />
                    </div>
                </div>
                <Button className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2">
                    {
                        settingsPennding ? <div className="w-7 h-7 rounded-full border-t-2 border-b-2 animate-spin"></div> : "Сохранить"
                    }
                </Button>
            </div>
        </form>
    )
}

export default Settings
