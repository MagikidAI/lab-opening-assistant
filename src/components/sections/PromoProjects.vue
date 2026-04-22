<template>
  <SectionCard icon="fas fa-rocket" :title="t('promoProjects')">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <label v-for="prog in programs" :key="prog.id" class="checkbox-item" :class="{ checked: selected.includes(prog.id) }">
        <input type="checkbox" :value="prog.id" v-model="selected" @change="store.savePromoProjects(selected)" class="w-4 h-4" style="accent-color: var(--accent-cyan);">
        <span>{{ t('prog_' + prog.id) || prog.name }}</span>
      </label>
    </div>
  </SectionCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import { MAGIKID_PROGRAMS } from '@/data/presets.js'
import SectionCard from '@/components/shared/SectionCard.vue'

const store = useLabStore()
const { t } = useI18n()
const programs = MAGIKID_PROGRAMS
const selected = ref([...store.promoProjects])
watch(() => store.promoProjects, val => { selected.value = [...val] })
</script>
