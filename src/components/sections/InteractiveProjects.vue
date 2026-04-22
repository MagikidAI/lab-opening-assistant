<template>
  <SectionCard icon="fas fa-gamepad" :title="t('interactiveProjects')">
    <div class="flex flex-col gap-3">
      <EmptyState v-if="store.projects.length === 0" icon="fas fa-gamepad" :message="t('noProjects')" />
      <div v-for="(p, i) in store.projects" :key="i" class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">{{ p.name }}</div>
          <div class="list-item-meta">
            <span class="badge badge-cyan">{{ typeLabel(p.type) }}</span>
            <span v-if="p.lead" class="meta-tag"><i class="fas fa-user"></i> {{ p.lead }}</span>
            <span v-if="p.duration" class="meta-tag"><i class="fas fa-clock"></i> {{ p.duration }}{{ t('minUnit') }}</span>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-secondary btn-icon" @click="editProject(i)"><i class="fas fa-edit"></i></button>
          <button class="btn btn-secondary btn-icon" @click="store.deleteProject(i)"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
    <button class="btn btn-secondary mt-4" @click="openAdd"><i class="fas fa-plus"></i> {{ t('addProject') }}</button>

    <BaseModal v-model="showModal" :title="t('addProject')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('projectName') }}</label>
          <input class="form-input" type="text" v-model="form.name" placeholder="如：机器人拔河比赛">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('projectType') }}</label>
          <select class="form-select" v-model="form.type">
            <option value="demo">{{ t('demo') }}</option>
            <option value="interactive">{{ t('interactive') }}</option>
            <option value="competition">{{ t('competition') }}</option>
            <option value="ai">{{ t('ai') }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('lead') }}</label>
          <input class="form-input" type="text" v-model="form.lead" placeholder="负责人姓名">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('duration') }}</label>
          <input class="form-input" type="number" v-model="form.duration" placeholder="30">
        </div>
      </div>
    </BaseModal>
  </SectionCard>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const store = useLabStore()
const { t } = useI18n()
const showModal = ref(false)
const editIndex = ref(-1)
const form = reactive({ name: '', type: 'demo', lead: '', duration: '' })

function typeLabel(type) {
  const map = { demo: t('demo'), interactive: t('interactive'), competition: t('competition'), ai: t('ai') }
  return map[type] || t('other')
}
function openAdd() { editIndex.value = -1; Object.assign(form, { name: '', type: 'demo', lead: '', duration: '' }); showModal.value = true }
function editProject(i) { editIndex.value = i; Object.assign(form, store.projects[i]); showModal.value = true }
function save() {
  if (!form.name) { alert(t('enterProjectName')); showModal.value = true; return }
  if (editIndex.value >= 0) store.updateProject(editIndex.value, { ...form })
  else store.addProject({ ...form })
  showModal.value = false
}
</script>
