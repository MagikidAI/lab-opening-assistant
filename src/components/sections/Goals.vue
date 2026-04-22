<template>
  <SectionCard icon="fas fa-bullseye" :title="t('goals')">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('campTarget') }}</label>
        <input class="form-input" type="number" v-model="goals.camp" @change="store.saveGoals(goals)">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('vexElementary') }}</label>
        <input class="form-input" type="text" v-model="goals.vexElementary" @change="store.saveGoals(goals)">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('vexMiddle') }}</label>
        <input class="form-input" type="text" v-model="goals.vexMiddle" @change="store.saveGoals(goals)">
      </div>
    </div>
    <div class="flex flex-col gap-2 mt-4">
      <label class="form-label">{{ t('otherGoals') }}</label>
      <textarea class="form-textarea" v-model="goals.other" @change="store.saveGoals(goals)" placeholder="其他活动目标..."></textarea>
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
const goals = reactive({ ...store.goals })
watch(() => store.goals, val => Object.assign(goals, val), { deep: true })
</script>
