"use client"

import {QuizzWithId, STORAGE_QUIZ_KEY} from "@rahoot/common/types/game"
import {STATUS} from "@rahoot/common/types/game/status"
import ManagerPassword, {PASSWORD_KEY} from "@rahoot/web/components/game/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/components/game/create/SelectQuizz"
import {useEvent, useSocket} from "@rahoot/web/contexts/socketProvider"
import {useManagerStore} from "@rahoot/web/stores/manager"
import {useRouter} from "next/navigation"
import {useState} from "react"
import Button from "@rahoot/web/components/Button";

const Manager = () => {
    const {setGameId, setStatus} = useManagerStore()
    const router = useRouter()
    const {socket} = useSocket()

    const [isAuth, setIsAuth] = useState(false)
    const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])


    useEvent("manager:quizzList", (quizzList) => {
        setIsAuth(true)
        setQuizzList(quizzList)
    })

    useEvent("manager:gameCreated", ({gameId, inviteCode}) => {
        setGameId(gameId)
        setStatus(STATUS.SHOW_ROOM, {text: "Waiting for the players", inviteCode})
        router.push(`/game/manager/${gameId}`)
    })

    const handleAuth = (password: string) => {
        socket?.emit("manager:auth", password)
        sessionStorage.setItem(PASSWORD_KEY, password)
    }
    const handleCreate = (quizzId: string) => {
        socket?.emit("game:create", quizzId)
    }

    if (!isAuth) {
        return <ManagerPassword onSubmit={handleAuth}/>
    }

    const handleEdit = (index: number) => {
        if (index === -1) return
        if (quizzList[index]) {
            const json = JSON.stringify(quizzList[index])
            console.log(json)
            localStorage.setItem(STORAGE_QUIZ_KEY, json)
            router.replace("/creator")
        }
    }

    // localStorage.setItem(STORAGE_QUIZ_KEY)
    //     router.replace("/creator")

    return <SelectQuizz quizzList={quizzList} onSelect={handleCreate} onEdit={handleEdit}/>
}

export default Manager
