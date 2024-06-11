"use client"
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { z } from 'zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Settings from './Settings';

type Inputs = {
    autoNumber: string;
    column: string;
    volume: string;
    price: string;
    isTaxi: string;
};

const formSchema = z.object({
    price: z.string(),
    autoNumber: z.string().min(8).max(8),
    isTaxi: z.string(),
});


const FormPanel = ({ token, setSearch, role, config, setIsPending, search, isPending, changeKub, bonus, setChangeKub, setBonus, setHandleUpdata, handleUpdata }: any) => {
    const [payWithBonus, setPayWithBonus] = useState(false);
    const [changePrice, setChangePrice] = useState(0);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();
    const nal = changePrice > bonus ? changePrice - bonus : changePrice;

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true);
        const sendData = {
            ...data,
            autoNumber: search.toUpperCase(),
            column: 1,
            type: 2,
            price: changePrice,
            isTaxi: data.isTaxi === "1",
            useBonus: payWithBonus,
        };

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, sendData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    setSearch("");
                    reset();
                    setChangeKub();
                    setChangePrice(0);
                    setBonus(0)
                    setIsPending(false)
                    setHandleUpdata(!handleUpdata)
                }
            });
    }

    function changeKubFn(v: number) {
        setChangeKub(v);
        setChangePrice(v * config.price);
    }

    return (
        <div className="h-full flex flex-col overflow-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full p-5 rounded-lg bg-[#121212]">
                <div className="flex flex-col gap-2">
                    <Input
                        type="number"
                        onKeyUpCapture={(e: any) => changeKubFn(+e.target.value)}
                        {...register("volume", { required: true, })}
                        className={`w-full h-full text-2xl px-5 bg-[#242424] text-white ${errors.volume && "border-[red] outline-[red]"}`}
                        placeholder="Kub"
                        disabled={isPending || search === ""}
                        defaultValue={changeKub}
                    />

                    <Input
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        type="text"
                        value={config.price}
                        placeholder="Sum"
                        onChange={() => { }}
                    />

                    <Input
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        type="number"
                        disabled={isPending || search === ""}
                        {...register("price", {
                            required: true,
                        })}
                        placeholder="Sum"
                        value={Math.ceil(changePrice)}
                    />
                </div>
                <div className="h-fit w-full mt-3">
                    <p>bonus: {Math.ceil(bonus).toLocaleString('uz')}</p>
                    <div className="grid grid-cols-1 gap-3 h-fit items-center justify-between mt-2">
                        <Button
                            disabled={isPending || search === ""}
                            onClick={() => setPayWithBonus(false)}
                            type="submit"
                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2"
                        >
                            {Math.ceil(changePrice).toLocaleString("uz")} cум
                        </Button>
                        <Button
                            disabled={isPending || bonus == 0 || search === ""}
                            onClick={() => setPayWithBonus(true)}
                            type="submit"
                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2 flex items-center justify-around"
                        >
                            <p className="block">Оплатить используя бонуса</p>
                            <p className="block">{Math.ceil(nal).toLocaleString("uz")} сум</p>
                        </Button>
                    </div>
                </div>
            </form>
            {
                role === "admin" && (
                    // <form className="h-full mt-5 p-5 rounded-lg bg-[#121212]">
                    //     <div className="flex flex-col gap-4">
                    //         <h2 className="text-2xl font-medium">Настройки</h2>
                    //         <label>
                    //             <p className="text-lg mb-1">День</p>
                    //             <Input
                    //                 type="number"
                    //                 // onChange={(e) => setDays(+e.target.value)}
                    //                 defaultValue={config.days}
                    //                 className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                    //                 {...register("days", {
                    //                     required: true,
                    //                 })}
                    //             />
                    //         </label>
                    //         <label className="">
                    //             <p className="text-lg mb-1">М Куб</p>
                    //             <Input
                    //                 type="number"
                    //                 // onChange={(e) => setMKub(+e.target.value)}
                    //                 defaultValue={config.price}
                    //                 className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                    //                 {...register("price", {
                    //                     required: true,
                    //                 })}
                    //             />
                    //         </label>
                    //         <Button className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2">
                    //             {
                    //                 settingsPennding ? <div className="w-7 h-7 rounded-full border-t-2 border-b-2 animate-spin"></div> : "Сохранить"
                    //             }
                    //         </Button>
                    //     </div>
                    // </form>
                    <Settings token={token} config={config} />
                )
            }
        </div>
    )
}

export default FormPanel
