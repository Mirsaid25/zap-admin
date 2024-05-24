"use client"
import { deleteCookie, getCookie, setCookie } from "cookies-next"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"
import action from "@/actions/action"

const ModalSession = ({ setCloseSession }: any) => {
    const { push } = useRouter()

    const sessionId = getCookie("sessionId")
    const token = getCookie("zapAdminToken")

    const updateSession = () => {
        axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`, {
            active: false
        }, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            if (res.status === 200 || res.status === 201) {
                deleteCookie('zapAdminRole')
                deleteCookie('sessionId')
                deleteCookie('zapAdminRoleId')
                deleteCookie('zapOperatorName')
                setCookie("updatedAt", res.data.updatedAt)
                // action("/sessions")
                push("/session-info")
            }
        })
    }

    return (
        <div onClick={() => setCloseSession(false)} className='fixed top-0 left-0 h-screen w-full bg-black/30 backdrop-blur-sm z-50'>
            <div onClick={(e) => e.stopPropagation()} className="max-w-xl w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-9 rounded-lg bg-white">
                <p>Уверены?</p>
                <div className="flex items-center justify-between">
                    <Button type={"button"} onClick={() => setCloseSession(false)} className="mt-4">Назад</Button>
                    <Button variant={"destructive"} onClick={updateSession} className="mt-4">Закрыть сессию</Button>
                </div>
            </div>
        </div>
    )
}

export default ModalSession
