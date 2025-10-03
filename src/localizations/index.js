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

// Kullanıcının dil tercihini localStorage'dan al veya tarayıcı dilini tespit et
export function getInitialLanguage() {
  // Önce localStorage'a bakılır
  const saved = localStorage.getItem(LANGUAGE_KEY)
  if (saved && translations[saved]) {
    return saved
  }
  
  // Sonra tarayıcı dilini kontrol et
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0] // 'tr-TR' -> 'tr'
  
  if (translations[langCode]) {
    return langCode
  }
  
  // Varsayılan olarak Türkçe
  return 'tr'
}

// Dil tercihini localStorage'a kaydet
export function saveLanguage(languageCode) {
  localStorage.setItem(LANGUAGE_KEY, languageCode)
}

// Lokalizasyon composable'ı
export function useI18n() {
  return {
    translations,
    availableLanguages,
    getInitialLanguage,
    saveLanguage
  }
}