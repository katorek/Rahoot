import {DEFAULT_LANGUAGE} from "@rahoot/web/utils/translations"
import {Languages} from "@rahoot/common/types/game";

const STORAGE_KEY = "language"

const isLanguages = (value: string): value is Languages =>
  value === Languages.PL || value === Languages.EN

export function readLanguage(): Languages {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_LANGUAGE
  return isLanguages(raw) ? raw : DEFAULT_LANGUAGE
}

export function writeLanguage(lang: Languages) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, lang)
}