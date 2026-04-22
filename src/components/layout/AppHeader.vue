<template>
  <header class="sticky top-0 z-[100] backdrop-blur-[10px]" style="background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); border-bottom: 1px solid var(--border-color); box-shadow: 0 0 30px rgba(0, 212, 255, 0.1);">
    <div class="max-w-[1600px] mx-auto px-8 py-4 flex justify-between items-center flex-wrap gap-4">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <div class="h-[52px] flex items-center">
          <img src="https://media.magikidlab.com/new/common/logo/magikid_robotics_logo.png" alt="MAGIKID Robotics Logo" class="h-[52px] w-auto object-contain">
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-[0.15em] uppercase" style="background: linear-gradient(135deg, var(--accent-cyan) 0%, #ffffff 50%, var(--accent-gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            {{ t('appSubtitleHeader') }}
          </h1>
          <span class="text-[0.7rem] tracking-[0.3em] uppercase font-medium" style="color: var(--accent-cyan);">Opening Assistant</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 items-center flex-wrap">
        <button class="btn btn-secondary" @click="handlePreset" :title="t('presetDataTitle')">
          <i class="fas fa-magic"></i> <span class="hidden sm:inline">{{ t('preset') }}</span>
        </button>
        <button class="btn btn-secondary" @click="showAchievements = true" title="MAGIKID成就">
          <i class="fas fa-trophy"></i> <span class="hidden sm:inline">成就</span>
        </button>
        <button class="btn btn-secondary font-semibold min-w-[70px]" @click="toggleLanguage">
          🌐 {{ currentLang === 'zh' ? 'CN' : 'EN' }}
        </button>
        <button class="btn btn-cyan" @click="$emit('exportPDF')">
          <i class="fas fa-file-pdf"></i> PDF
        </button>
        <button class="btn btn-secondary" @click="store.exportData()">
          <i class="fas fa-download"></i> <span class="hidden sm:inline">{{ t('export') }}</span>
        </button>
        <button class="btn btn-primary" @click="triggerLoad">
          <i class="fas fa-folder-open"></i> <span class="hidden sm:inline">{{ t('load') }}</span>
        </button>
        <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleLoad">
      </div>
    </div>

    <!-- Achievements Modal -->
    <div v-if="showAchievements" class="modal-overlay active" style="align-items: flex-start; padding-top: 5vh;" @click.self="showAchievements = false">
      <div class="modal" style="max-width: 700px;">
        <div class="modal-header">
          <h3>🏆 MAGIKID Achievements</h3>
          <button class="modal-close" @click="showAchievements = false">&times;</button>
        </div>
        <div class="modal-body" style="display: grid; gap: 1.5rem;">
          <div v-for="(ach, key) in MAGIKID_ACHIEVEMENTS" :key="key" class="rounded-xl p-5" style="background: var(--bg-secondary); border: 1px solid var(--border-color);">
            <h4 class="font-bold text-base mb-3" style="color: var(--accent-gold);">{{ ach.title }}</h4>
            <div class="flex flex-wrap gap-2 mb-3">
              <span v-for="y in ach.years" :key="y" class="badge badge-cyan">{{ y }}</span>
            </div>
            <ul class="space-y-1">
              <li v-for="s in ach.stats" :key="s" class="text-sm flex gap-2 items-start" style="color: var(--text-secondary);">
                <i class="fas fa-check-circle mt-0.5 flex-shrink-0" style="color: var(--success);"></i>{{ s }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showAchievements = false">关闭</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import { useLabStore } from '@/stores/lab.js'
import { MAGIKID_ACHIEVEMENTS } from '@/data/presets.js'

const emit = defineEmits(['exportPDF'])
const { t, currentLang, toggleLanguage } = useI18n()
const store = useLabStore()

const showAchievements = ref(false)
const fileInput = ref(null)

const currentLabId = ref('lasvegas')
const labOptions = [
  { value: 'lasvegas', label: '🏜️ Las Vegas Lab' },
  { value: 'san-jose', label: '🏙️ San Jose Lab' },
  { value: 'frisco', label: '🏡 Frisco Lab' },
  { value: 'shanghai', label: '🌆 Shanghai Lab' },
  { value: 'wuzhen', label: '🏯 Wuzhen Lab' },
  { value: 'new', label: t('addNewLab') },
]

function handleLabChange(value) {
  if (value === 'new') {
    const name = prompt(t('enterLabName'))
    if (name) {
      labOptions.push({ value: name.toLowerCase().replace(/\s+/g, '-'), label: `🏢 ${name}` })
      store.saveLab({ name })
      currentLabId.value = labOptions[labOptions.length - 1].value
    } else {
      currentLabId.value = 'lasvegas'
    }
  } else {
    currentLabId.value = value
  }
}

async function handlePreset() {
  if (!confirm(t('loadPreset'))) return
  const urlParams = new URLSearchParams(window.location.search)
  let labId = urlParams.get('labid')
  if (!labId) {
    const hashQuery = window.location.hash.split('?')[1]
    if (hashQuery) labId = new URLSearchParams(hashQuery).get('labid')
  }
  if (labId) {
    await store.initFromLabAPI(labId, { force: true })
  } else {
    store.resetToEmpty()
  }
  alert(t('loadSuccess'))
}

function triggerLoad() { fileInput.value.click() }

function handleLoad(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result)
      store.loadFromJSON(parsed)
      location.reload()
    } catch {
      alert('文件格式错误，请上传有效的 JSON 文件。')
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}
</script>
