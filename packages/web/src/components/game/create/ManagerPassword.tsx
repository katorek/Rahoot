import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent } from "@rahoot/web/contexts/socketProvider"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"
import {useI18n} from "@rahoot/web/contexts/i18nProvider";
import {LanguageSwitcher} from "@rahoot/web/components/LanguageSwitcherComponent";

type Props = {
  onSubmit: (_password: string) => void
}

const ManagerPassword = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    onSubmit(password)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  useEvent("manager:errorMessage", (message) => {
    toast.error(message)
  })
  const {t} = useI18n()

  return (
    <Form>
      <LanguageSwitcher/>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("manager_password")}
      />
      <Button onClick={handleSubmit}>{t("submit")}</Button>
    </Form>
  )
}

export default ManagerPassword
