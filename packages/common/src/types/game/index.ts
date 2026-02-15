export enum Languages {
    PL = "PL", EN = "EN"
}

export const STORAGE_QUIZ_KEY = "quiz"

export type Player = {
    id: string
    clientId: string
    connected: boolean
    username: string
    points: number
}

export type Answer = {
    playerId: string
    points: number
    answerIds: number[]
}

export type LanguageData = {
    question: string
    answers: string[]
}

export function getLanguage(): Languages {
    const userLang = localStorage.getItem("language")

    let lang: Languages
    switch (userLang) {
        case null:
            lang = Languages.PL;
            break;
        case "PL":
            lang = Languages.PL;
            break;
        case "EN":
            lang = Languages.EN;
            break;
        default:
            lang = Languages.PL;
            break;
    }

    return lang
}

export enum QuestionType {
    MULTI_CHOICE = "MULTI_CHOICE",
    SINGLE_CHOICE = "SINGLE_CHOICE",
}

export type Question = {
    questionType: QuestionType
    languageData: Partial<Record<Languages, LanguageData>>
    solution: number[]
    image?: string
    video?: string
    audio?: string
    cooldown: number
    time: number
}

export type Quizz = {
    filename: string | undefined
    subject: string
    languages: Languages[]
    questions: Question[]
}

export type QuizzWithId = Quizz & { id: string }

export type GameUpdateQuestion = {
    current: number
    total: number
}
