'use client'
import axios from "axios"
import { cookies } from "next/headers"
import SesionInfoChild from "./components/SesioninfoChild"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"

const Page = () => {
    const [result, setResult] = useState()
    const operatorLogin = getCookie("operatorLogin")
    const createdAt = getCookie("createdAt")
    const updatedAt = getCookie("updatedAt")
    const token = getCookie("zapAdminToken")

    const { push } = useRouter()

    useEffect(() => {
        async function getData() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports?operator.login=${operatorLogin}&createdAt[$gte]=${createdAt}&updatedAt[$lt]=${updatedAt}`, {
                headers: {
                    'Authorization': `${token}`
                }
            })

            if (res.status === 500) {
                push("/log-in")
            } else {
                const data = await res.json()
                setResult(data)
            }
        }
        getData()
    }, [])

    return (
        <div className='h-screen w-full z-50'>
            <div className="w-full px-8 py-9 rounded-lg">
                <SesionInfoChild res={result} />
            </div>
        </div>
    )
}

export default Page
