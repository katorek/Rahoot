import {LanguageData, Question, QuestionType, Quizz} from "@rahoot/common/types/game";

export function initialQuestion(): Question {
    return {
        questionType: QuestionType.SINGLE_CHOICE,
        languageData: {},
        solution: [],
        cooldown: 4,
        time: 20
    }
}

export function emptyLanguageData(): LanguageData {
    return {
        question: '',
        answers: []
    }
}


export function initialQuiz(): Quizz {
    return {
        filename: `${Math.floor(Math.random() * 1000)}`,
        subject: "",
        languages: [],
        questions: [],
    }
}