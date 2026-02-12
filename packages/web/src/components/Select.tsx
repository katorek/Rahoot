import clsx from "clsx"
import React, {useState, useRef, useEffect} from "react"

export type MultiSelectOption<T extends string = string> = {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export type MultiSelectProps<T extends string = string> = {
  options: readonly MultiSelectOption<T>[]
  value: T[]
  onChange: (next: T[]) => void
  label?: React.ReactNode
  helperText?: React.ReactNode
  className?: string
  selectLabel?: string
  selectClassName?: string
    requireAtLeastOne?: boolean
    disabled?: boolean
  name?: string
  id?: string
}

export default function MultiSelect<T extends string = string>({
  options,
                                                                   value,
    selectLabel = "Select options...",
                                                                   onChange,
                                                                   label,
                                                                   helperText,
                                                                   className,
                                                                   selectClassName,
                                                                   requireAtLeastOne,
                                                                   disabled,
                                                                   name,
                                                                   id,
                                                               }: MultiSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const toggleOption = (optionValue: T) => {
        if (disabled) return

        const isRemoving = value.includes(optionValue)

        if (isRemoving && requireAtLeastOne && value.length === 1) {
            return
        }

        const newValue = isRemoving
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]

        onChange(newValue)
    }

    const selectedLabels = value
        .map((v) => options.find((opt) => opt.value === v)?.label)
        .filter(Boolean)

    return (
        <div className={clsx("relative flex flex-col gap-2 z-20", className)} ref={dropdownRef}>
        {label ? (
                <label htmlFor={id} className="text-sm font-semibold text-slate-800">
                    {label}
                </label>
            ) : null}

            <input type="hidden" name={name} value={value.join(",")}/>

            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "min-h-10 rounded-md border border-slate-300 bg-white p-2",
                    "text-sm outline-none focus:ring-2 focus:ring-slate-400/60",
                    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
                    "flex items-center justify-between text-left",
                    selectClassName,
                )}
            >
        <span className="flex-1 truncate">
          {value.length === 0 ? (
              <span className="text-slate-400">{selectLabel}</span>
          ) : (
              <span>{selectedLabels.map((l) => String(l)).join(", ")}</span>
          )}
        </span>
                <svg
                    className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className={clsx(
                        "absolute z-10 mt-1 max-h-60 overflow-auto rounded-md border border-slate-300 bg-white shadow-lg",
                        "w-full",
                    )}
                >
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className={clsx(
                                "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50",
                                opt.disabled && "cursor-not-allowed opacity-50",
                            )}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(opt.value)}
                                onChange={() => toggleOption(opt.value)}
                                disabled={opt.disabled || disabled}
                                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-400"
                            />
                            <span>{String(opt.label)}</span>
                        </label>
                    ))}
                </div>
            )}

            {helperText ? (
                <div className="text-xs text-slate-500">{helperText}</div>
            ) : null}
        </div>
  )
}