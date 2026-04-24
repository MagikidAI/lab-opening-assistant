<template>
  <SectionCard icon="fas fa-clipboard-list" :title="t('checklist')">
    <div class="flex flex-col gap-2">
      <div v-for="(item, i) in checklistItems" :key="i" class="checklist-item" :class="{ checked: store.checklist[i] }">
        <div class="checklist-checkbox" @click="store.toggleChecklist(i)">
          <i v-if="store.checklist[i]" class="fas fa-check text-xs"></i>
        </div>
        <span v-if="!editing[i]" class="checklist-text flex-1" @click="store.toggleChecklist(i)">{{ item }}</span>
        <input v-else class="flex-1 bg-bg-primary border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none" v-model="editTexts[i]" @keydown.enter="saveEdit(i)" @keydown.escape="cancelEdit(i)">
        <button class="btn-icon" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; width: 28px; height: 28px;" @click.stop="toggleEdit(i)">
          <i :class="editing[i] ? 'fas fa-check' : 'fas fa-pen'" style="font-size: 0.75rem;"></i>
        </button>
        <input type="text" class="text-right text-sm" style="width: 100px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 0.2rem 0.4rem; color: var(--accent-cyan);" :placeholder="t('checklistOwnerPlaceholder')" :value="store.checklistOwners[i]" @input="store.updateChecklistOwner(i, $event.target.value)">
      </div>
    </div>
    <div class="progress-bar mt-6">
      <div class="progress-fill" :style="{ width: store.checklistProgress + '%' }"></div>
    </div>
    <p class="text-center mt-2 text-sm" style="color: var(--text-secondary);">
      {{ store.checklist.filter(Boolean).length }}/{{ store.checklist.length }} {{ t('completed') }}
    </p>
  </SectionCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'

const store = useLabStore()
const { t, currentLang } = useI18n()

// Use translations-provided default list; user-edited items (store.checklistItems) override.
const defaultItems = computed(() => {
  // Access currentLang to make this reactive on language toggle.
  void currentLang.value
  return t('checklistItems')
})
const checklistItems = computed(() => store.checklistItems || defaultItems.value)
const editing = ref(Array(15).fill(false))
const editTexts = ref([...checklistItems.value])

function toggleEdit(i) {
  if (editing.value[i]) {
    saveEdit(i)
  } else {
    editTexts.value[i] = checklistItems.value[i]
    editing.value[i] = true
  }
}
function saveEdit(i) {
  if (editTexts.value[i].trim()) {
    store.updateChecklistItem(i, editTexts.value[i].trim())
  }
  editing.value[i] = false
}
function cancelEdit(i) {
  editing.value[i] = false
}
</script>
