"use client"
import { deleteCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect, useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from 'react';

type Inputs = {
    password: string;
    login: string
};

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [ISpandding, setISpandding] = useState(false);
    const { push } = useRouter()
    const [role, setRole] = useState("");
    const [filedErr, setFiledErr] = useState("");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setISpandding(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authentication/${role}`, { ...data, strategy: 'local' })
            .then((res) => {
                console.log(res);
                if (res.status === 200 || res.status === 201) {
                    if (res.data.admin) {
                        setCookie('zapAdminToken', res.data.accessToken);
                        setCookie('zapAdminRoleId', res.data.admin._id);
                        setCookie('zapAdminRole', 'admin');
                        setCookie('zapOperatorName', res.data.admin.login);
                        push("/dashboard")
                        setISpandding(false)
                    } else {
                        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, { active: true }, {
                            headers: {
                                Authorization: res.data.accessToken
                            }
                        }).then(response => {
                            console.log(response.data, "dedede");
                            if (response.status === 200 || response.status === 201) {
                                setCookie("sessionId", response.data._id)
                                setCookie("operatorLogin", response.data.operator.login)
                                setCookie("createdAt", response.data.createdAt)

                                setCookie('zapAdminToken', res.data.accessToken);
                                setCookie('zapAdminRoleId', res.data.operator._id);
                                setCookie('zapAdminRole', 'operator');
                                setCookie('zapOperatorName', res.data.operator.fullName);
                                push("/dashboard")
                                setISpandding(false)
                            }
                        })
                    }
                }
            }).catch(err => {
                setISpandding(false)
                // console.log(err.response.data.message);

                setFiledErr(err.response.data.message)
                console.log(err)
            })
        // github_4             password
        // ozodbek_shukurov     log in
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Роль:</label>
                        <p className=''>
                            {
                                role === "" ? "Выберите роль" : ""
                            }
                        </p>
                    </div>
                    <Select onValueChange={(e) => setRole(e)} >
                        <SelectTrigger id='role'>
                            <SelectValue placeholder="Роль" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admins">Admin</SelectItem>
                            <SelectItem value="operators">Operator</SelectItem>
                        </SelectContent>
                    </Select>
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2 mt-4">Пароль:</label>
                    <Input
                        disabled={ISpandding || role ? false : true}
                        type="password"
                        placeholder='Пароль'
                        id="password"
                        {...register('password', { required: 'Password is required' })}
                        className={`border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    <label htmlFor="login" className="block text-gray-700 font-bold mb-2 mt-4">Логин:</label>
                    <Input
                        disabled={ISpandding || role ? false : true}
                        type="text"
                        placeholder='Логин'
                        id="login"
                        {...register('login', { required: 'log in is required' })}
                        className={`border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline ${errors.login ? 'border-red-500' : ''}`}
                    />
                    {errors.login && <p className="text-red-500 text-xs italic">{errors.login.message}</p>}
                </div>
                <p className='text-center mb-2 text-red-500'>
                    {filedErr}
                </p>
                <Button
                    onClick={() => setFiledErr(role === "" ? "выберите роль" : "")}
                    disabled={ISpandding}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
