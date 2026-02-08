"use client"

import {CommonStatusDataMap} from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/components/AnswerButton"
import MultiAnswerButton from "@rahoot/web/components/MultiAnswerButton"
import {useEvent, useSocket} from "@rahoot/web/contexts/socketProvider"
import {usePlayerStore} from "@rahoot/web/stores/player"
import {ANSWERS_COLORS, ANSWERS_ICONS, SFX_ANSWERS_MUSIC, SFX_ANSWERS_SOUND,} from "@rahoot/web/utils/constants"
import clsx from "clsx"
import {useParams} from "next/navigation"
import {useEffect, useState} from "react"
import useSound from "use-sound"
import {useI18n} from "@rahoot/web/contexts/i18nProvider";

type Props = {
    data: CommonStatusDataMap["SELECT_ANSWER"]
    isServer: boolean
}

const Answers = ({
                     data: {
                         languageData,
                         questionType,
                         image,
                         audio,
                         video,
                         time,
                         totalPlayer,
                     },
                     isServer,
                 }: Props) => {
    const {gameId}: { gameId?: string } = useParams()
    const {socket} = useSocket()
    const {player} = usePlayerStore()

	const { lang, t } = useI18n()
    const [cooldown, setCooldown] = useState(time)
    const [totalAnswer, setTotalAnswer] = useState(0)
    const [selected, setSelected] = useState<number[]>([])

    const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
        volume: 0.1,
    })

    const [playMusic, {stop: stopMusic}] = useSound(SFX_ANSWERS_MUSIC, {
        volume: 0.2,
        interrupt: true,
        loop: true,
    })
    const languageQuestion = languageData[lang]?.question || ""

    const handleMultiClick = (answerKey: number) => () => {
        if (!player) {
            return
        }

        setSelected((prev) => {
            if (prev.includes(answerKey)) {
                return prev.filter((key) => key !== answerKey)
            }
            return [...prev, answerKey]
        })
    }

    const handleAnswer = (answerKey: number) => () => {
        if (!player) {
            return
        }

        socket?.emit("player:selectedAnswer", {
            gameId,
            data: {
                answerKeys: [answerKey],
            },
        })
        sfxPop()
    }
    
    const handleSubmit = () => {
        if (!player) {
            return
        }

        socket?.emit("player:selectedAnswer", {
            gameId,
            data: {
                answerKeys: selected,
            },
        })
        sfxPop()
    }

    useEffect(() => {
        if (video || audio) {
            return
        }

        playMusic()

        // eslint-disable-next-line consistent-return
        return () => {
            stopMusic()
        }
    }, [playMusic])

    useEvent("game:cooldown", (sec) => {
        setCooldown(sec)
    })

    useEvent("game:playerAnswer", (count) => {
        setTotalAnswer(count)
        sfxPop()
    })


    return (
        <div className="flex h-full flex-1 flex-col justify-between">
            <div
                className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
                <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                    {Boolean(isServer) && (
                        <>
                            {Object.values(languageData).map((data, index) => (
                                <span key={index}>
                                    {data.question}
                                    {index < Object.values(languageData).length - 1 && <br/>}
                                </span>
                            ))}
                        </>
                    )}

                    {!Boolean(isServer) && (languageQuestion)}
                </h2>

                {Boolean(audio) && !player && (
                    <audio
                        className="m-4 mb-2 w-auto rounded-md"
                        src={audio}
                        autoPlay
                        controls
                    />
                )}

                {Boolean(video) && !player && (
                    <video
                        className="m-4 mb-2 aspect-video max-h-60 w-auto rounded-md px-4 sm:max-h-100"
                        src={video}
                        autoPlay
                        controls
                    />
                )}

                {Boolean(image) && (
                    <img
                        alt={languageQuestion}
                        src={image}
                        className="mb-2 max-h-60 w-auto rounded-md px-4 sm:max-h-100"
                    />
                )}
            </div>

            <div>
                <div
                    className="mx-auto mb-4 flex w-full max-w-7xl justify-between gap-1 px-2 text-lg font-bold text-white md:text-xl">
                    <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">
              {t("time")}
            </span>
                        <span>{cooldown}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">
              {t("answer")}
            </span>
                        <span>
              {totalAnswer}/{totalPlayer}
            </span>
                    </div>
                </div>

                {questionType === "SINGLE_CHOICE" && (
                    <div
                        className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-lg font-bold text-white md:text-xl">
                        {(languageData[lang]?.answers || []).map((answer, key) => (
                            <AnswerButton
                                key={key}
                                className={clsx(ANSWERS_COLORS[key])}
                                icon={ANSWERS_ICONS[key]}
                                onClick={handleAnswer(key)}
                            >
                                {answer}
                            </AnswerButton>
                        ))}
                    </div>
                )}

                {questionType === "MULTI_CHOICE" && (
                    <>
                        <div
                            className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-lg font-bold text-white md:text-xl">
                            {(languageData[lang]?.answers || []).map((answer, key) => (
                                <MultiAnswerButton
                                    checked={selected.includes(key)}
                                    key={key}
                                    className={clsx(ANSWERS_COLORS[key])}
                                    icon={ANSWERS_ICONS[key]}
                                    onClick={handleMultiClick(key)}
                                >
                                    {answer}
                                </MultiAnswerButton>
                            ))}
                        </div>
                        <div className="mx-auto mb-4 flex w-full max-w-7xl justify-center px-2">
                            <button
                                onClick={() => handleSubmit()}
                                className="rounded-full bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                            >
                                {t("submit")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Answers
