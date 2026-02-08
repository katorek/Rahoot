"use client"

import {ManagerStatusDataMap} from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/components/AnswerButton"
import MultiAnswerButton from "@rahoot/web/components/MultiAnswerButton"
import {
    ANSWERS_COLORS,
    ANSWERS_ICONS,
    SFX_ANSWERS_MUSIC,
    SFX_RESULTS_SOUND,
} from "@rahoot/web/utils/constants"
import {calculatePercentages} from "@rahoot/web/utils/score"
import clsx from "clsx"
import {useEffect, useState} from "react"
import useSound from "use-sound"
import {QuestionType} from "@rahoot/common/types/game";

type Props = {
    data: ManagerStatusDataMap["SHOW_RESPONSES"]
}

const Responses = ({
                       data: {
                           defaultLang,
                           languageData,
                           questionType,
                           responses,
                           correct,
                       },
                   }: Props) => {
    const [percentages, setPercentages] = useState<Record<string, string>>({})
    const [isMusicPlaying, setIsMusicPlaying] = useState(false)

    const [sfxResults] = useSound(SFX_RESULTS_SOUND, {
        volume: 0.2,
    })

    const [playMusic, {stop: stopMusic}] = useSound(SFX_ANSWERS_MUSIC, {
        volume: 0.2,
        onplay: () => {
            setIsMusicPlaying(true)
        },
        onend: () => {
            setIsMusicPlaying(false)
        },
    })

    useEffect(() => {
        stopMusic()
        sfxResults()

        setPercentages(calculatePercentages(responses))
    }, [responses, playMusic, stopMusic, sfxResults])

    useEffect(() => {
        if (!isMusicPlaying) {
            playMusic()
        }
    }, [isMusicPlaying, playMusic])

    useEffect(() => {
        stopMusic()
    }, [playMusic, stopMusic])

    const answers = languageData[defaultLang]?.answers || []
    const numOfAnswers = languageData[defaultLang]?.answers?.length || 0

    return (
        <div className="flex h-full flex-1 flex-col justify-between">
            <div
                className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
                <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                    {Object.values(languageData).map((data, index) => (
                        <span key={index}>
                            {data.question}
                            {index < Object.values(languageData).length - 1 && <br/>}
                         </span>
                    ))}
                </h2>

                <div
                    className={`mt-8 grid h-40 w-full max-w-3xl gap-4 px-2`}
                    style={{gridTemplateColumns: `repeat(${numOfAnswers}, 1fr)`}}
                >
                    {answers.map((_, key) => (
                        <div
                            key={key}
                            className={clsx(
                                "flex flex-col justify-end self-end overflow-hidden rounded-md",
                                ANSWERS_COLORS[key],
                            )}
                            style={{height: percentages[key]}}
                        >
              <span className="w-full bg-black/10 text-center text-lg font-bold text-white drop-shadow-md">
                {responses[key] || 0}
              </span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div
                    className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-lg font-bold text-white md:text-xl">

                    {questionType === QuestionType.SINGLE_CHOICE &&
                        answers.map((answer, key) => (
                            <AnswerButton
                                key={key}
                                className={clsx(ANSWERS_COLORS[key], {
                                    "opacity-65": responses && !correct.includes(key),
                                })}
                                icon={ANSWERS_ICONS[key]}
                            >
                                {Object.values(languageData).map((data, index) => (
                                    <span key={index}>
                                        {data.answers[key]}
                                        {index < Object.values(languageData).length - 1 && <br/>}
                                    </span>
                                ))}
                            </AnswerButton>
                        ))}
                    {questionType === QuestionType.MULTI_CHOICE &&
                        answers.map((answer, key) => (
                            <MultiAnswerButton
                                checked={correct.includes(key)}
                                key={key}
                                className={clsx(ANSWERS_COLORS[key], {
                                    "opacity-65": responses && !correct.includes(key),
                                })}
                                icon={ANSWERS_ICONS[key]}
                            >
                                {Object.values(languageData).map((data, index) => (
                                    <span key={index}>
                                        {data.answers[key]}
                                        {index < Object.values(languageData).length - 1 && <br/>}
                                    </span>
                                ))}
                            </MultiAnswerButton>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Responses
