import {QuizzWithId} from "@rahoot/common/types/game"
import Button from "@rahoot/web/components/Button"
import clsx from "clsx"
import {useState} from "react"
import toast from "react-hot-toast"
import {useI18n} from "@rahoot/web/contexts/i18nProvider";
import {useRouter} from "next/navigation";

type Props = {
  quizzList: QuizzWithId[]
  onSelect: (_id: string) => void
  onEdit: (_id: number) => void
}

const SelectQuizz = ({ quizzList, onSelect, onEdit}: Props) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number>(-1)
  const router = useRouter()

  const handleSelect = (id: string, index: number) => () => {
    if (selected === id) {
      setSelected(null)
      setSelectedId(-1)
    } else {
      setSelected(id)
      setSelectedId(index)
    }
  }

  const handleSubmit = () => {
    if (!selected) {
      toast.error("Please select a quizz")

      return
    }

    onSelect(selected)
  }
  const {t} = useI18n()

  const edit = () => {
    onEdit(selectedId)
  }

  return (
    <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl font-bold">{t("select_quiz")}</h1>
        <div className="w-full space-y-2">
          {quizzList.map((quizz, index) => (
            <button
              key={quizz.id}
              className={clsx(
                "flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300",
              )}
              onClick={handleSelect(quizz.id, index)}
            >
              {quizz.subject}

              <div
                className={clsx(
                  "h-5 w-5 rounded outline outline-offset-3 outline-gray-300",
                  selected === quizz.id &&
                    "bg-primary border-primary/80 shadow-inset",
                )}
              ></div>
            </button>
          ))}
        </div>
      </div>
      <Button disabled={selected === null} onClick={edit}>{t("edit")}</Button>
      <Button disabled={selected === null} onClick={handleSubmit}>{t("submit")}</Button>
      <Button onClick={() => router.push("/")} >{t("home")}</Button>
    </div>
  )
}

export default SelectQuizz
