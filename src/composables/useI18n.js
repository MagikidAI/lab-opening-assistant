import { ref, readonly } from 'vue'
import { translations } from '@/data/translations.js'

const currentLang = ref(localStorage.getItem('magikidLabLang') || 'zh')

export function useI18n() {
  function t(key) {
    return translations[currentLang.value][key] || key
  }

  function toggleLanguage() {
    currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('magikidLabLang', currentLang.value)
    document.documentElement.lang = currentLang.value
  }

  return {
    currentLang: readonly(currentLang),
    t,
    toggleLanguage
  }
}
