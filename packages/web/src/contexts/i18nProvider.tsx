// packages/web/src/contexts/i18nProvider.tsx
"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {translations, type TranslationKey, Languages} from "@rahoot/web/utils/translations"
import { readLanguage, writeLanguage } from "@rahoot/web/utils/i18n/storage"

type I18nParams = Record<string, string | number>

type I18nContextValue = {
  lang: Languages
  setLang: (lang: Languages) => void
  t: (key: TranslationKey, params?: I18nParams) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function format(template: string, params?: I18nParams) {
  if (!params) return template
  return template.replace(/\{(\w+)}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined || value === null ? match : String(value)
  })
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Languages>(Languages.PL)

  useEffect(() => {
    setLangState(readLanguage())
  }, [])

  const setLang = (next: Languages) => {
    setLangState(next)
    writeLanguage(next)
  }

  const t = (key: TranslationKey, params?: I18nParams) =>
    format(translations[lang][key], params)

  const value = useMemo(() => ({ lang, setLang, t }), [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider />")
  return ctx
}