import {Quizz} from "@rahoot/common/types/game";
import {useEffect, useState} from "react";
import {isValidQuizz} from "@rahoot/web/app/creator/page";
import {useI18n} from "@rahoot/web/contexts/i18nProvider";

type QuizJsonProps = {
    quiz: Quizz
    rawText: string
    onRawTextChange: (text: string) => void
    validChange: (isValid: boolean) => void
}

const QuizJson = ({quiz, rawText, onRawTextChange, validChange}: QuizJsonProps) => {
    const [validationError, setValidationError] = useState<string>("");
    const {t} = useI18n()

    useEffect(() => {
        if (!rawText.trim()) {
            setValidationError("");
            return;
        }

        try {
            const parsed = JSON.parse(rawText);
            const validation = isValidQuizz(parsed, t);
            if (!validation.valid) {
                setValidationError(validation.error);
            } else {
                setValidationError("");
            }
            validChange(validation.valid);
        } catch (error) {
            setValidationError(error instanceof Error ? error.message : "Invalid JSON");
            validChange(false);
        }
    }, [rawText]);

    return (
        <div className="flex flex-col gap-2">
            <textarea
                className={`w-full min-h-96 p-2 border rounded-md font-mono text-sm ${validationError ? "border-red-500" : ""}`}
                value={rawText}
                onChange={(e) =>  onRawTextChange(e.target.value)}
            />
            {validationError && (
                <div className="text-red-500 text-sm">
                    {t("validation_error")} {validationError}
                </div>
            )}
        </div>
    )
}
export default QuizJson;