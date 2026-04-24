<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
    <div class="quick-stat">
      <div class="quick-stat-icon gold"><i class="fas fa-calendar-check"></i></div>
      <div class="quick-stat-info">
        <div class="number">{{ store.daysLeft > 0 ? store.daysLeft : t('opened') }}</div>
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

<style scoped>
/* Mobile: compact cards so two fit per row comfortably */
@media (max-width: 639.98px) {
  .quick-stat {
    min-width: 0;
    padding: 0.75rem 0.85rem;
    gap: 0.6rem;
    min-width: 0;
  }
  .quick-stat :deep(.quick-stat-icon) {
    width: 2.25rem; height: 2.25rem;
    font-size: 0.95rem;
    border-radius: 0.65rem;
    flex-shrink: 0;
  }
  .quick-stat :deep(.quick-stat-info) { min-width: 0; }
  .quick-stat :deep(.quick-stat-info .number) {
    font-size: 1rem;
    line-height: 1.25;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .quick-stat :deep(.quick-stat-info .label) {
    font-size: 0.68rem;
    line-height: 1.2;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
}
</style>
