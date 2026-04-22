<template>
  <SectionCard icon="fas fa-clock" :title="t('activityFlow')">
    <div class="timeline">
      <div v-if="store.timeline.length === 0">
        <EmptyState icon="fas fa-clock" :message="t('noTimeline')" />
      </div>
      <div v-for="(item, i) in store.timeline" :key="i" class="timeline-item">
        <div class="timeline-time">{{ item.time || t('timeTBD') }}</div>
        <div class="timeline-content">{{ item.title }}</div>
        <div class="timeline-detail">{{ item.detail }}</div>
        <div class="flex gap-2 mt-3">
          <button class="btn btn-secondary btn-sm" @click="editItem(i)"><i class="fas fa-edit"></i> {{ t('editBtn') }}</button>
          <button class="btn btn-secondary btn-sm" @click="store.deleteTimeline(i)"><i class="fas fa-trash"></i> {{ t('deleteBtn') }}</button>
        </div>
      </div>
    </div>
    <button class="btn btn-secondary mt-4" @click="openAdd">
      <i class="fas fa-plus"></i> {{ t('addTimeline') }}
    </button>

    <BaseModal v-model="showModal" :title="t('addTimeline')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('time') }}</label>
          <input class="form-input" type="time" v-model="form.time">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('activityName') }}</label>
          <input class="form-input" type="text" v-model="form.title" placeholder="如：开业典礼、剪彩仪式">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('details') }}</label>
          <textarea class="form-textarea" v-model="form.detail" placeholder="活动详情、涉及人员等..."></textarea>
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
const form = reactive({ time: '', title: '', detail: '' })

function openAdd() { editIndex.value = -1; Object.assign(form, { time: '', title: '', detail: '' }); showModal.value = true }
function editItem(i) { editIndex.value = i; Object.assign(form, store.timeline[i]); showModal.value = true }
function save() {
  if (!form.title) { alert(t('enterActivityName')); showModal.value = true; return }
  if (editIndex.value >= 0) store.updateTimeline(editIndex.value, { ...form })
  else store.addTimeline({ ...form })
  showModal.value = false
}
</script>
