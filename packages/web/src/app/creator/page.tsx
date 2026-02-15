"use client"

import Input from "@rahoot/web/components/Input";
import {useEffect, useState} from "react";
import Button from "@rahoot/web/components/Button";
import {LanguageData, Languages, Question, QuestionType, Quizz, STORAGE_QUIZ_KEY} from "@rahoot/common/types/game";
import Expandable from "@rahoot/web/app/creator/Expandable";
import QuestionCreator from "@rahoot/web/app/creator/QuestionCreator";
import QuizJson from "@rahoot/web/app/creator/QuizJson";
import MultiSelect, {MultiSelectOption} from "@rahoot/web/components/Select";
import {initialQuestion, initialQuiz} from "@rahoot/web/app/creator/helpers";
import {useRouter} from "next/navigation";
import {useI18n} from "@rahoot/web/contexts/i18nProvider";
import {LanguageSwitcher} from "@rahoot/web/components/LanguageSwitcherComponent";
import {TranslationKey} from "@rahoot/web/utils/translations";
import clsx from "clsx";
import {useSocket} from "@rahoot/web/contexts/socketProvider";



const RemoveIcon = ({color = "currentColor"}: { color?: string }) => (
    <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill={color}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
            clipRule="evenodd"
        />
    </svg>
)


export function isValidQuizz(obj: any, t: (key: TranslationKey, params?: Record<string, string | number>) => string): { valid: boolean; error: string } {
    if (!obj || typeof obj !== 'object') {
        return {valid: false, error: t("e_object")};
    }

    if (!Array.isArray(obj.languages) || obj.languages.length === 0) {
        return {valid: false, error: t("e_languages")};
    }

    for (const lang of obj.languages) {
        if (!Object.values(Languages).includes(lang)) {
            return {valid: false, error: t("e_languages_2", {lang})};
        }
    }

    if (!obj.subject || typeof obj.subject !== 'string') {
        return {valid: false, error: t("e_subject")};
    }

    if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
        return {valid: false, error: t("e_questions")};
    }

    for (let i = 0; i < obj.questions.length; i++) {
        const q = obj.questions[i];

        if (!q || typeof q !== 'object') {
            return {valid: false, error: t("e_question", {i})};
        }

        if (!Object.values(QuestionType).includes(q.questionType)) {
            return {valid: false, error: t("e_questionType", {i})};
        }

        if (!q.languageData || typeof q.languageData !== 'object') {
            return {valid: false, error: t("e_q_langData", {i})};
        }

        if (!Array.isArray(q.solution)) {
            return {valid: false, error: t("e_q_solution", {i})};
        }

        if (typeof q.cooldown !== 'number' || typeof q.time !== 'number') {
            return {valid: false, error: t("e_q_cooldown", {i})};
        }
    }

    return {valid: true, error: ""};
}

const languageOptions: MultiSelectOption<Languages>[] = Object.values(Languages).map(
    (lang) => ({
        value: lang,
        label: lang, // or a nicer label like "Polski" / "English"
    }),
)

export function obtainFilename (quiz: Quizz){
    const subject = quiz.subject.replace(/[^a-zA-Z0-9]/g, "_")
    return `${subject}_${quiz.languages.join("_")}.json`
}

const Creator = () => {
    const {socket} = useSocket()
    const {t} = useI18n()
    const obtainExistingQuizOrInitEmpty = () => {
        const rawText = localStorage.getItem(STORAGE_QUIZ_KEY)
        console.log("quiz", rawText)

        if (rawText === null) return initialQuiz()
        const parsed = JSON.parse(rawText || "");

        const validation = isValidQuizz(parsed, t);
        console.log("validation", validation)

        if (validation.valid) {
            return parsed
        } else {
            localStorage.removeItem(STORAGE_QUIZ_KEY)
            return initialQuiz()
        }
    }
    const router = useRouter()
    const [quizInitialized, setQuizInitialized] = useState<boolean>(false)
    const [rawTextValid, setRawTextValid] = useState<boolean>(false)
    const [quiz, setQuiz] = useState<Quizz>(initialQuiz())
    const [rawText, setRawText] = useState<string>("")

    useEffect(() => {
        if(!quizInitialized) {
            setQuizInitialized(true)
            setQuiz(obtainExistingQuizOrInitEmpty())
        }
    }, []);


    useEffect(() => {
        if(quizInitialized){
            localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(quiz))
            console.log("quiz updated", quiz)
        }
    }, [quiz])

    const newQuestion = () => {
        setQuiz((prev) => ({
            ...prev,
            questions: [...prev.questions, initialQuestion()],
        }))
    }

    const removeQuestion = (index: number) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }))
    }

    const importRawText = () => {
        try {
            const json = JSON.parse(rawText)

            const validation = isValidQuizz(json, t);
            if (!validation.valid) {
                alert("Invalid quiz format: " + validation.error);
                return;
            }

            setQuiz(json)
            console.log(json)
        } catch (error) {
            alert("Failed to parse JSON: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    }

    const exportRawText = () => {
        setRawText(JSON.stringify(quiz, null, 2))
    }

    const questionChanged = (newQuestion: Question, index: Number) => {
        setQuiz((prev) => ({...prev, questions: prev.questions.map((q, i) => (i === index ? newQuestion : q))}))
    }

    const setLanguages = (selectedLanguages: Languages[]) => {
        setQuiz((prev) => ({...prev, languages: selectedLanguages}))
    }

    const home = () => {
        router.replace("/")
    }

    const save = () => {
        const json = JSON.stringify(quiz)
        localStorage.setItem(STORAGE_QUIZ_KEY, json)
        socket?.emit("creator:saveQuiz", json, obtainFilename(quiz))
        home()
    }

    return (
        <>
            <div className="z-10 flex rounded-md shadow-sm items-start">

                <div className="z-10 flex w-2/3 flex-col  gap-2 m-10 rounded-md bg-white p-4 shadow-sm self-start">
                    <Expandable title={t("creator_base_info")}>
                        <div>
                            <Input
                                className={clsx("col-span-2 w-full-1", (quiz.subject.length ===0 ) && "outline-red-600")}
                                value={quiz.subject}
                                type="text"
                                onChange={(e) => { setQuiz({...quiz, subject: e.target.value})}}
                                placeholder={t("creator_quizname")}
                            />
                        </div>

                        <div className="flex justify-between m-3" >
                            <div className="flex items-center gap-2">
                                <span>{t("choose_langs")}</span>
                                <MultiSelect
                                    className={clsx("w-35", (quiz.languages.length ===0 ) && " outline-red-600 outline-2 rounded-md")}
                                    selectLabel={t("langs")}
                                    options={languageOptions}
                                    value={quiz.languages}
                                    requireAtLeastOne={true}
                                    selectClassName={clsx("w-35", (quiz.languages.length ===0 ) && "outline-red-600")}
                                    onChange={(selected) => setLanguages(selected)}/>
                            </div>
                            <Button className="" onClick={() => setQuiz(initialQuiz())}>
                                {t("remove_quiz")}
                            </Button>
                        </div>

                    </Expandable>


                    {quiz.questions.map((question, index) => (
                        <Expandable
                            title={
                                <div className="flex w-full justify-between items-center">
                                    <span className="">{t("question")} {index + 1}/{quiz.questions.length}</span>
                                    <Button className="bg-transparent h-10 w-14 flex self-end items-center justify-center btn-shadow"
                                            onClick={() => removeQuestion(index)}> <RemoveIcon
                                        color="red"></RemoveIcon></Button>
                                </div>
                            }
                            key={index}
                        >
                            <QuestionCreator
                                languages={quiz.languages}
                                question={question}
                                onQuestionChange={(newQuestion) => questionChanged(newQuestion, index)}/>
                        </Expandable>
                    ))}

                    <Button onClick={newQuestion} disabled={quiz.languages.length === 0}>{t("add_question")}</Button>
                </div>
                <div className="z-10 flex w-1/2 flex-col gap-4 m-10 rounded-md bg-white p-4 shadow-sm self-start">
                    <QuizJson
                        quiz={quiz}
                        rawText={rawText}
                        onRawTextChange={(newText) => setRawText(newText)}
                        validChange={(valid) => setRawTextValid(valid)}
                    />
                    <div className="flex gap-2">
                        <Button className="w-1/2" onClick={() => exportRawText()}>{t("creator_export")}</Button>
                        <Button className="w-1/2" onClick={() => importRawText()}>{t("creator_import")}</Button>
                    </div>
                    <Button disabled={rawText.length===0 || !rawTextValid} onClick={save}>{t("save")}</Button>
                    <Button onClick={home}>{t("home")}</Button>
                    <LanguageSwitcher/>
                </div>
            </div>

        </>
    )
}

export default Creator