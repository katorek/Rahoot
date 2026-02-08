"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"
import ControlSwitch from "@rahoot/web/components/ControlSwitch"
import {LanguageSwitcher} from "@rahoot/web/components/LanguageSwitcherComponent";
import {useI18n} from "@rahoot/web/contexts/i18nProvider";

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")

  // const [language, setLang] = useState(
  //   localStorage.getItem("language") || "pl",
  // )

  const handleLogin = () => {
    if (!gameId) {
      return
    }
    // localStorage.setItem("language", language)

    socket?.emit("player:login", {
      gameId,
      data: { username },
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", (gameId) => {
    setStatus(STATUS.WAIT, { text: t("waiting_for_players") })
    login(username)

    router.replace(`/game/${gameId}`)
  })
  const { lang, t } = useI18n()

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("username")}
      />
      <LanguageSwitcher/>
      {/*<ControlSwitch*/}
      {/*  label={language === "pl" ? "Polski" : "English"}*/}
      {/*  checked={language === "en"}*/}
      {/*  onChange={(e) => (language === "en" ? setLang("pl") : setLang("en"))}*/}
      {/*/>*/}
      <Button onClick={handleLogin}>
        {t("submit")}
      </Button>
    </Form>
  )
}

export default Username
