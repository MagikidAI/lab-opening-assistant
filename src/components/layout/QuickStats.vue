<template>
  <div class="flex gap-4 mb-6 overflow-x-auto pb-2">
    <div class="quick-stat">
      <div class="quick-stat-icon gold"><i class="fas fa-calendar-check"></i></div>
      <div class="quick-stat-info">
        <div class="number">{{ store.daysLeft > 0 ? store.daysLeft : '已开业' }}</div>
        <div class="label">{{ t('daysLeft') }}</div>
      </div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-icon cyan"><i class="fas fa-users"></i></div>
      <div class="quick-stat-info">
        <div class="number">{{ store.guestCount }}</div>
        <div class="label">{{ t('guests') }}</div>
      </div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-icon gold"><i class="fas fa-tasks"></i></div>
      <div class="quick-stat-info">
        <div class="number">{{ store.checklistProgress }}%</div>
        <div class="label">{{ t('progress') }}</div>
      </div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat-icon cyan"><i class="fas fa-dollar-sign"></i></div>
      <div class="quick-stat-info">
        <div class="number">${{ store.totalBudgetAmount.toLocaleString() }}</div>
        <div class="label">{{ t('totalBudget') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'

const store = useLabStore()
const { t } = useI18n()
</script>
