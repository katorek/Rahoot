import {LanguageData, Player, QuestionType} from "."
import {Languages, TRANSLATION_KEYS, TranslationKey} from "@rahoot/web/utils/translations";

export const STATUS = {
  SHOW_ROOM: "SHOW_ROOM",
  SHOW_START: "SHOW_START",
  SHOW_PREPARED: "SHOW_PREPARED",
  SHOW_QUESTION: "SHOW_QUESTION",
  SELECT_ANSWER: "SELECT_ANSWER",
  SHOW_RESULT: "SHOW_RESULT",
  SHOW_RESPONSES: "SHOW_RESPONSES",
  SHOW_LEADERBOARD: "SHOW_LEADERBOARD",
  FINISHED: "FINISHED",
  WAIT: "WAIT",
} as const

export type Status = (typeof STATUS)[keyof typeof STATUS]

export type CommonStatusDataMap = {
  SHOW_START: { time: number; subject: string }
  SHOW_PREPARED: { totalAnswers: number; questionNumber: number }
  SHOW_QUESTION: {
    languageData: Record<Languages, LanguageData>
    image?: string
    cooldown: number
  }
  SELECT_ANSWER: {
    questionType: QuestionType
    languageData: Record<Languages, LanguageData>
    image?: string
    video?: string
    audio?: string
    time: number
    totalPlayer: number
  }
  SHOW_RESULT: {
    correct: boolean
    message: TranslationKey
    points: number
    myPoints: number
    rank: number
    aheadOfMe: string | null
  }
  WAIT: { text?: string, key?: TranslationKey }
  FINISHED: { subject: string; top: Player[] }
}

type ManagerExtraStatus = {
  SHOW_ROOM: { text: string; inviteCode?: string }
  SHOW_RESPONSES: {
    defaultLang: Languages
    questionType: QuestionType
    languageData: Record<Languages, LanguageData>
    responses: Record<number, number>
    correct: number[]
    image?: string
    video?: string
  }
  SHOW_LEADERBOARD: { oldLeaderboard: Player[]; leaderboard: Player[] }
}

export type PlayerStatusDataMap = CommonStatusDataMap
export type ManagerStatusDataMap = CommonStatusDataMap & ManagerExtraStatus
export type StatusDataMap = PlayerStatusDataMap & ManagerStatusDataMap
