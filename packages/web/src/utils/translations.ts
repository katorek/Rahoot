import {Languages} from "@rahoot/common/types/game"

export const DEFAULT_LANGUAGE: Languages = Languages.PL

export const TRANSLATION_KEYS = [
    "time",
    "answer",
    "submit",
    "username",
    "close",
    "select_lang",
    "waiting_for_players",
    "waiting_for_answers",
    "waiting",
    "select_quiz",
    "leaderboard",
    "question",
    "nice",
    "too_bad",
    "rank",
    "rank_ahead",
    "join_game",
    "game_pin",
    "players_joined",
    "manager_password",
    "start_game",
    "skip",
    "next",
    "selected"


] as const
export type TranslationKey = (typeof TRANSLATION_KEYS)[number]

type Dictionary = Record<TranslationKey, string>

export const translations: Record<Languages, Dictionary> = {
    [Languages.EN]: {
        time: "Time",
        answer: "Answers",
        submit: "Submit",
        username: "Username",
        close: "Close",
        select_lang: "Select language",
        waiting_for_players: "Waiting for the players",
        waiting_for_answers: "Waiting for the players to answer",
        waiting: "Waiting for the players to answer",
        select_quiz: "Select a quizz",
        leaderboard: "Leaderboard",
        question: "Question",
        nice:" Nice!",
        too_bad:"Too bad",
        rank: "You are top {rank}",
        rank_ahead: "You are top {rank}, behind {rank_ahead}",
        join_game: "Join the game at",
        game_pin: "Game PIN:",
        players_joined: "Players joined: {count}",
        manager_password: "Manager password",
        start_game: "Start Game",
        skip: "Skip",
        next: "Next",
        selected: "Selected"

    },
    [Languages.PL]: {
        time: "Czas",
        answer: "Odpowiedzi",
        submit: "Zatwierdź",
        username: "Użytkownik",
        close: "Zamknij",
        select_lang: "Wybierz język",
        waiting_for_players: "Oczekiwanie na graczy",
        waiting_for_answers: "Oczekiwanie na odpowiedzi graczy",
        waiting: "Oczekiwanie",
        select_quiz: "Wybierz quiz",
        leaderboard: "Wyniki",
        question: "Pytanie",
        nice:" Dobrze!",
        too_bad:"Źle",
        rank: "Jesteś {rank}",
        rank_ahead: "Jesteś {rank}, za {rank_ahead}",
        join_game: "Dołącz do gry",
        game_pin: "PIN do gry:",
        players_joined: "Dołączyło {count} graczy",
        manager_password: "Hasło menadżera",
        start_game: "Start gry",
        skip: "Pomiń",
        next: "Dalej",
        selected: "Wybrany",
    },
}