import {Languages, Question, QuestionType} from "@rahoot/common/types/game";
import Input from "@rahoot/web/components/Input";
import Button from "@rahoot/web/components/Button";
import Checkbox from "@rahoot/web/components/Checkbox";
import {useState, useEffect} from "react";
import clsx from "clsx";
import {emptyLanguageData} from "@rahoot/web/app/creator/helpers";
import {useI18n} from "@rahoot/web/contexts/i18nProvider";

type QuestionCreatorProps = {
    question: Question,
    languages: Languages[],
    onQuestionChange: (question: Question) => void
}

const newAnswer = (languages: Languages[]) => {
    return languages.reduce((acc, lang) => ({
        ...acc,
        [lang]: ""
    }), {} as Partial<Record<Languages, string>>)
}

const mapAnswers = (question: Question, languages: Languages[]): Partial<Record<Languages, string>>[] => {
    const result: Partial<Record<Languages, string>>[] = []
    if (languages.length === 0) return result;
    const actualAnswerCount = question.languageData[languages[0]]?.answers.length || 0

    const answerCount = actualAnswerCount < 2 ? 2 : actualAnswerCount

    for (let i = 0; i < answerCount; i++) {
        const obj: Partial<Record<Languages, string>> = {}
        Object.values(languages).forEach(lang => {
            obj[lang] = question.languageData[lang]?.answers?.[i] || ""
        })
        result.push(obj)
    }

    console.log("answerCount", answerCount, result)


    return result
}

const QuestionCreator = ({question, languages, onQuestionChange}: QuestionCreatorProps) => {
    console.log("QuestionCreator")

    const [answerTime, setAnswerTime] = useState<number>(question.time )
    const [cooldown, setCooldown] = useState<number>(question.cooldown || 0)
    const [hasVideo, setHasVideo] = useState(Boolean(question.video))
    const [hasAudio, setHasAudio] = useState(Boolean(question.audio))
    const [hasImage, setHasImage] = useState(Boolean(question.image))
    const [answerList, setAnswerList] = useState<Partial<Record<Languages, string>>[]>(mapAnswers(question, languages))
    const [solutions, setSolutions] = useState<number[]>(question.solution)
    const [url, setUrl] = useState(question.image || question.audio || question.video || "")
    const [urlDisabled, setUrlDisabled] = useState(!hasImage && !hasAudio && !hasVideo)
    const {t} = useI18n()

    const initQuestionClone = () => {
        const answersCount = answerList.length < 2 ? 2 : answerList.length

        return {
            ...question,
            languageData: {
                ...question.languageData,
                ...languages.reduce((acc, lang) => ({
                    ...acc,
                    [lang]: {
                        question: "",
                        answers: answerList.map(langData => langData[lang] || ""),
                        // answers: Array(answersCount).map((v, i) => {
                        //
                        //     return ""
                        // }),
                        ...question.languageData[lang],
                    }
                }), {})
            }
        }
    }

    const [updatedQuestion, setUpdatedQuestion] = useState<Question>(initQuestionClone())

    const toggleVideo = () => {
        setHasImage(false)
        setHasAudio(false)
        setHasVideo((prev) => !prev)
    }

    const toggleAudio = () => {
        setHasImage(false)
        setHasAudio((prev) => !prev)
        setHasVideo(false)
    }
    const toggleImage = () => {
        setHasImage((prev) => !prev)
        setHasAudio(false)
        setHasVideo(false)
    }


    const addAnswer = () => {
        if (answerList.length > 5) return
        setAnswerList([...answerList, newAnswer(languages)])
    }

    const removeAnswer = () => {
        if (answerList.length < 3) return
        const newLen = answerList.length - 1

        setAnswerList(answerList.slice(0, -1))
        if (solutions.includes(newLen)) {
            setSolutions(solutions.filter(i => i !== newLen))
        }
    }


    const toggleAnswear = (index: number) => {
        const newSolutions = [...solutions]
        if (newSolutions.includes(index)) {
            newSolutions.splice(newSolutions.indexOf(index), 1)
        } else {
            newSolutions.push(index)
        }
        setSolutions(newSolutions)
    }

    const updateQuestion = (lang: Languages, value: string) => {
        setUpdatedQuestion((prevQuestion: Question) => {
            const newLanguageData = {...prevQuestion.languageData};
            if (newLanguageData[lang]) {
                newLanguageData[lang] = {
                    ...newLanguageData[lang]!,
                    question: value
                };
            } else {
                newLanguageData[lang] = {
                    ...emptyLanguageData(),
                    question: value
                }
            }
            return {
                ...prevQuestion,
                languageData: newLanguageData
            };
        })
    }

    const updateAnswer = (lang: Languages, index: number, value: string) => {
        setUpdatedQuestion((prevQuestion: Question) => {
            const newLanguageData = {...prevQuestion.languageData};
            if (newLanguageData[lang]) {
                const newAnswers = [...(newLanguageData[lang]?.answers || [])];
                newAnswers[index] = value;
                newLanguageData[lang] = {
                    ...newLanguageData[lang]!,
                    answers: newAnswers
                };
            }
            return {
                ...prevQuestion,
                languageData: newLanguageData
            };
        });
    }

    // effects

    useEffect(() => {
        onQuestionChange(updatedQuestion)
    }, [updatedQuestion])

    useEffect(() => {
        console.log("QiestionList updated ")
    }, [answerList]);

    useEffect(() => {
        setUrlDisabled(!hasImage && !hasAudio && !hasVideo)

        setUpdatedQuestion((prevQuestion: Question) => ({
            ...prevQuestion,
            image: hasImage ? url : undefined,
            audio: hasAudio ? url : undefined,
            video: hasVideo ? url : undefined
        }))


    }, [hasImage, hasAudio, hasVideo, url]);
    useEffect(() => {
        setUpdatedQuestion((prevQuestion: Question) => ({
            ...prevQuestion,
            time: answerTime,
            cooldown: cooldown
        }));
    }, [cooldown, answerTime]);

    useEffect(() => {
        setUpdatedQuestion((prevQuestion: Question) => ({
            ...prevQuestion,
            solution: solutions,
            questionType: solutions.length > 1 ? QuestionType.MULTI_CHOICE : QuestionType.SINGLE_CHOICE
        }))
    }, [solutions]);


    // init
    /*  useEffect(() => {
          for (let i = answerList.length; i < 2; i++) {
              addAnswer()
          }

          let needUpdate = false;
          const langData = question.languageData || {}
          Object.values(languages).forEach(lang => {
              if (!question.languageData[lang]) {
                  needUpdate = true;
              } else {
                  const q = question.languageData[lang]?.question || ""
                  const a = question.languageData[lang]?.answers || []

                  langData[lang] = {question: q, answers: a}
              }
          })
          if (needUpdate) setUpdatedQuestion({...question, languageData: langData})

      })*/

    return (
        <>
            <div className="mx-auto grid w-full grid-cols-6 gap-3 px-2">
                {/* Questions  */}
                <span className="col-span-1 font-semibold self-baseline">{t("question")}</span>
                <div className="col-span-5 font-semibold items-baseline">
                    {languages.map((lang) => (
                        <>
                            <Input
                                key={"question_" + lang}
                                className="col-span-3 w-full"
                                type="text"
                                onChange={(e) => {
                                    updateQuestion(lang, e.target.value)
                                }/*quiz.questions[questionId](e.target.value)*/}
                                placeholder={lang}
                                value={question.languageData[lang]?.question || ""}
                            />
                        </>
                    ))}
                </div>

                {/* Image, Audio, Video */}
                <div className="col-span-6 flex gap-2 justify-between flex-center items-center">
                    <Checkbox label={t("image")} className="" onClick={toggleImage} checked={hasImage} onChange={() => {
                    }}/>
                    <Checkbox label={t("audio")} className="" onClick={toggleAudio} checked={hasAudio} onChange={() => {
                    }}/>
                    <Checkbox label={t("video")} className="" onClick={toggleVideo} checked={hasVideo} onChange={() => {
                    }}/>
                    <Input
                        className={clsx("flex-1", urlDisabled && "opacity-40 cursor-not-allowed")}
                        type="text"
                        onChange={(e) => {
                            setUrl(e.target.value)
                        }}
                        placeholder="url"
                        disabled={urlDisabled}
                        value={url}
                    />

                    <span>{t("answer_time")}</span>
                    <Input
                        className="w-13"
                        type="number"
                        value={answerTime}
                        onChange={(e) => setAnswerTime(Number(e.target.value))}
                        placeholder={t("answer_time")}
                    />
                    <span>{t("cooldown")}</span>
                    <Input
                        className="w-13"
                        type="number"
                        value={cooldown}
                        onChange={(e) => setCooldown(Number(e.target.value))}
                        placeholder={t("cooldown")}
                    />

                </div>
                {/* Shuffle answer order */}
                {/* Answers  */}

                <div className="col-span-1 flex flex-col font-semibold self-baseline">
                    <span>{t("answers")}</span>
                    <div className="flex gap-2">

                        <Button className="h-8 w-8 flex items-center justify-center" onClick={addAnswer}>+</Button>
                        <Button className="h-8 w-8 flex items-center justify-center" onClick={removeAnswer}>-</Button>
                    </div>

                </div>
                <div className="col-span-5">
                    {answerList.map((questionLang, index) => (
                        <div className={clsx("flex col-span-5 gap-2 font-semibold items-baseline", {
                                "mb-2": index < answerList.length - 1
                            }
                        )}>
                            <Checkbox
                                className="m-2 w-10"
                                onClick={() => toggleAnswear(index)}
                                checked={solutions.includes(index)}
                                onChange={() => {
                                }}/>
                            {languages.map((lang) => (
                                <Input
                                    key={"answer_" + lang + "_" + index}
                                    className={clsx("w-full", {
                                        "outline-3 outline-green-600": solutions.includes(index),
                                        "outline-red-600": !solutions.includes(index)
                                    })}
                                    // className="w-full"
                                    type="text"
                                    onChange={(e) => updateAnswer(lang, index, e.target.value)}
                                    placeholder={lang}
                                    value={question.languageData[lang]?.answers?.[index] || ""}
                                />
                            ))}
                        </div>

                    ))}
                </div>
            </div>
        </>
    )
        ;
};

export default QuestionCreator;
