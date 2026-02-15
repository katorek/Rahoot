"use client"

import Room from "@rahoot/web/components/game/join/Room"
import Username from "@rahoot/web/components/game/join/Username"
import {useEvent, useSocket} from "@rahoot/web/contexts/socketProvider"
import {usePlayerStore} from "@rahoot/web/stores/player"
import {useEffect} from "react"
import toast from "react-hot-toast"
import Button from "@rahoot/web/components/Button";
import {useI18n} from "@rahoot/web/contexts/i18nProvider";
import {useRouter} from "next/navigation";
import {LanguageSwitcher} from "@rahoot/web/components/LanguageSwitcherComponent";

const Home = () => {
    const {isConnected, connect} = useSocket()
    const {player} = usePlayerStore()
    const router = useRouter()

    const {t} = useI18n()

    useEffect(() => {
        if (!isConnected) {
            connect()
        }
    }, [connect, isConnected])

    useEvent("game:errorMessage", (message) => {
        toast.error(message)
    })

    const creator = () => {
        router.replace("/creator")
    }
    const manager = () => {
        router.replace("/manager")
    }

    if (player) {
        return <Username/>
    }

    return (
        <>
            <div className="z-10 flex w-full max-w-80 flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
                <Room/>
                <LanguageSwitcher/>
                <Button onClick={creator}>{t("creator")}</Button>
                <Button onClick={manager}>{t("manager")}</Button>
                {/*<Video/>*/}
            </div>

        </>

    )
}

export default Home
