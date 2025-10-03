import tr from './tr.js'
import en from './en.js'
import de from './de.js'

const LANGUAGE_KEY = 'portfolio_language'

export const translations = {
  tr,
  en,
  de
}

export const availableLanguages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

export function getInitialLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY)
  if (saved && translations[saved]) {
    return saved
  }
  
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0]
  
  if (translations[langCode]) {
    return langCode
  }
  
  return 'tr'
}

export function saveLanguage(languageCode) {
  localStorage.setItem(LANGUAGE_KEY, languageCode)
}

export function useI18n() {
  return {
    translations,
    availableLanguages,
    getInitialLanguage,
    saveLanguage
  }
}