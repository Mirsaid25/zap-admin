"use client"

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'
import axios from 'axios'

const formSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    login: z.string().min(1, { message: "Log in is required" })
})

const AddedOperator = ({ token }: { token: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filedErr, setFiledErr] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            password: "",
            login: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/operators`, values, {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                console.log(res.data);
                setIsOpen(false)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <div className="">
                <Button onClick={() => setIsOpen(true)}>Добавить оператора</Button>
            </div>

            {isOpen ?
                <div onClick={() => setIsOpen(false)} className='fixed top-0 left-0 h-screen w-full bg-black/30 backdrop-blur-sm z-50'>
                    <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-9 rounded-lg bg-white">
                        <p className='text-lg font-medium mb-5 text-black'>Добавить оператора</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-black">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input autoComplete='off' placeholder="Ф.И.О" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input autoComplete='off' placeholder="Пароль" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="login"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input autoComplete='off' placeholder="Логин" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button className='w-full'>Создать</Button>
                            </form>
                        </Form>
                    </div>
                </div>
                : null}
        </>
    )
}

export default AddedOperator
