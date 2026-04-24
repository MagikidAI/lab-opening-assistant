import { ref, readonly } from 'vue'
import { translations } from '@/data/translations.js'
import { useLabStore } from '@/stores/lab.js'

const currentLang = ref(localStorage.getItem('magikidLabLang') || 'zh')
let migratedOnce = false

export function useI18n() {
  function t(key) {
    return translations[currentLang.value][key] || key
  }

  function toggleLanguage() {
    currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('magikidLabLang', currentLang.value)
    document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en-US'
    try { useLabStore().migrateLanguageDefaults(currentLang.value) } catch { /* store not ready */ }
  }

  // Run migration once per page load so pre-existing localStorage data follows the current lang.
  if (!migratedOnce) {
    migratedOnce = true
    document.documentElement.lang = currentLang.value === 'zh' ? 'zh-CN' : 'en-US'
    try { useLabStore().migrateLanguageDefaults(currentLang.value) } catch { /* store not ready */ }
  }

  return {
    currentLang: readonly(currentLang),
    t,
    toggleLanguage
  }
}
