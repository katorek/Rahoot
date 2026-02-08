"use client"

import clsx from "clsx"
import {useEffect, useId, useMemo, useRef, useState} from "react"
import {Languages} from "@rahoot/common/types/game"
import {useI18n} from "@rahoot/web/contexts/i18nProvider"

type Option = { value: Languages; label: string; shortLabel: string }

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  const listboxId = useId()


    const options: Option[] = useMemo(
    () => [
      { value: Languages.PL, label: "Polski (PL)", shortLabel: "PL" },
      { value: Languages.EN, label: "English (EN)", shortLabel: "EN" },
    ],
    [],
  )

  const selected = options.find((o) => o.value === lang) ?? options[0]

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === lang),
    ),
  )

  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === lang)))
  }, [lang, options])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!open) return
      const el = rootRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false)
    }
    window.addEventListener("mousedown", onMouseDown)
    return () => window.removeEventListener("mousedown", onMouseDown)
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const commit = (next: Languages) => {
    setLang(next)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onButtonKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen((v) => !v)
      return
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((prev) => {
        const delta = e.key === "ArrowDown" ? 1 : -1
        return (prev + delta + options.length) % options.length
      })
    }
  }

  const onListKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => {
        const delta = e.key === "ArrowDown" ? 1 : -1
        return (prev + delta + options.length) % options.length
      })
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      commit(options[activeIndex].value)
    }
  }

  return (
      <div className="flex flex-col gap-2" ref={rootRef}>
        <div className="relative">
          <button
            id={`${listboxId}-button`}
            ref={buttonRef}
            type="button"
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={onButtonKeyDown}
            className={clsx(
              "w-full rounded-sm border border-gray-200 bg-white",
              "p-2 pr-10 text-left text-lg font-semibold text-gray-900",
              "outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200",
            )}
          >
            {selected.shortLabel}

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              ▼
            </span>
          </button>

          {open && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              aria-hidden="true"
            >
              <button
                type="button"
                className="absolute inset-0 cursor-default bg-black/40"
                onClick={() => setOpen(false)}
                aria-label="Close language selector"
              />

              <div
                id={listboxId}
                role="listbox"
                aria-activedescendant={`${listboxId}-opt-${activeIndex}`}
                tabIndex={-1}
                onKeyDown={onListKeyDown}
                className={clsx(
                  "relative w-[min(92vw,28rem)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg",
                  "focus:outline-none",
                )}
              >
                <div className="border-b border-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  {t("select_lang")}
                </div>

                {options.map((opt, idx) => {
                  const isSelected = opt.value === lang
                  const isActive = idx === activeIndex

                  return (
                    <button
                      key={opt.value}
                      id={`${listboxId}-opt-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => commit(opt.value)}
                      className={clsx(
                        "flex w-full items-center justify-between px-3 py-3 text-left text-base",
                        isActive && "bg-gray-100",
                        !isActive && "bg-white",
                      )}
                    >
                      <span className="font-semibold text-gray-900">{opt.label}</span>
                      {isSelected && <span className="text-sm text-gray-500">Selected</span>}
                    </button>
                  )
                })}

                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-sm bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                  >{t("close")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
