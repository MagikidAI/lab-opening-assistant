<template>
  <SectionCard icon="fas fa-child" :title="t('ageGroups')">
    <div class="flex flex-col gap-4">
      <div v-for="row in ageRows" :key="row.id" class="age-row">
        <div class="age-label">
          <span class="age-range">{{ t(row.labelKey) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <input type="number" class="form-input w-20 text-center font-semibold" min="0" :value="age[row.countKey]" @input="onCountInput(row, $event)">
          <span class="text-sm" style="color: var(--text-secondary);">{{ t('personUnit') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <input type="number" class="form-input w-20 text-center font-semibold" min="0" max="100" step="0.1" :value="age[row.percentKey]" @input="onPercentInput(row, $event)">
          <span class="text-sm" style="color: var(--text-secondary);">%</span>
        </div>
        <div class="age-bar">
          <div class="age-bar-fill" :style="{ width: age[row.percentKey] + '%' }"></div>
        </div>
      </div>
      <div class="flex items-center gap-4 pt-4" style="border-top: 2px solid var(--border-color);">
        <span class="font-bold uppercase tracking-wide text-sm" style="color: var(--text-secondary);">{{ t('totalLabel') }}</span>
        <span class="text-3xl font-bold" style="background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{ store.totalStudents }}</span>
        <span style="color: var(--text-secondary);">{{ t('personUnit') }}</span>
      </div>
    </div>
  </SectionCard>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'

const store = useLabStore()
const { t } = useI18n()

const ageRows = [
  { id: 'age36', labelKey: 'age36', countKey: 'age36Count', percentKey: 'age36Percent', storeKey: 'age36' },
  { id: 'age714', labelKey: 'age714', countKey: 'age714Count', percentKey: 'age714Percent', storeKey: 'age714' },
  { id: 'age15', labelKey: 'age15', countKey: 'age15Count', percentKey: 'age15Percent', storeKey: 'age15' },
]

const age = reactive({
  age36Count: store.ageStructure.age36?.count ?? 12,
  age36Percent: store.ageStructure.age36?.percent ?? 14,
  age714Count: store.ageStructure.age714?.count ?? 65,
  age714Percent: store.ageStructure.age714?.percent ?? 76,
  age15Count: store.ageStructure.age15?.count ?? 10,
  age15Percent: store.ageStructure.age15?.percent ?? 10,
})

watch(() => store.ageStructure, (s) => {
  if (s) {
    age.age36Count = s.age36?.count ?? 12
    age.age36Percent = s.age36?.percent ?? 14
    age.age714Count = s.age714?.count ?? 65
    age.age714Percent = s.age714?.percent ?? 76
    age.age15Count = s.age15?.count ?? 10
    age.age15Percent = s.age15?.percent ?? 10
  }
}, { deep: true })

function recalcPercents() {
  const total = (age.age36Count || 0) + (age.age714Count || 0) + (age.age15Count || 0)
  if (total > 0) {
    age.age36Percent = +((age.age36Count / total) * 100).toFixed(1)
    age.age714Percent = +((age.age714Count / total) * 100).toFixed(1)
    age.age15Percent = +((age.age15Count / total) * 100).toFixed(1)
  }
  saveToStore()
}

function onCountInput(row, e) {
  age[row.countKey] = parseInt(e.target.value) || 0
  recalcPercents()
}
function onPercentInput(row, e) {
  age[row.percentKey] = parseFloat(e.target.value) || 0
  saveToStore()
}

function saveToStore() {
  store.saveAgeStructure({
    age36: { count: age.age36Count, percent: age.age36Percent },
    age714: { count: age.age714Count, percent: age.age714Percent },
    age15: { count: age.age15Count, percent: age.age15Percent },
  })
}
</script>
