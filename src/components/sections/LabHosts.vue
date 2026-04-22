<template>
  <SectionCard icon="fas fa-user-tie" :title="t('labHost')">
    <div class="flex flex-col gap-3">
      <div v-if="store.hosts.length === 0">
        <EmptyState icon="fas fa-user-tie" :message="t('noHostInfo')" />
      </div>
      <div v-for="(h, i) in store.hosts" :key="i" class="list-item">
        <div class="list-item-content">
          <div class="list-item-title">{{ h.name }}</div>
          <div class="list-item-subtitle">{{ h.background || t('noIntro') }}</div>
          <div class="list-item-meta">
            <span class="meta-tag"><i class="fas fa-envelope"></i> {{ h.email || t('noEmail') }}</span>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-secondary btn-icon" @click="editHost(i)"><i class="fas fa-edit"></i></button>
          <button class="btn btn-secondary btn-icon" @click="store.deleteHost(i)"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
    <button class="btn btn-secondary mt-4" @click="openAdd">
      <i class="fas fa-plus"></i> {{ t('addHost') }}
    </button>

    <BaseModal v-model="showModal" :title="t('addHost')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('name') }}</label>
          <input class="form-input" type="text" v-model="form.name" :placeholder="t('name')">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('background') }}</label>
          <textarea class="form-textarea" v-model="form.background" placeholder="个人背景介绍..."></textarea>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('email') }}</label>
          <input class="form-input" type="email" v-model="form.email" placeholder="email@example.com">
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
const form = reactive({ name: '', background: '', email: '' })

function openAdd() {
  editIndex.value = -1
  Object.assign(form, { name: '', background: '', email: '' })
  showModal.value = true
}
function editHost(i) {
  editIndex.value = i
  Object.assign(form, store.hosts[i])
  showModal.value = true
}
function save() {
  if (!form.name) { alert(t('enterName')); return }
  if (editIndex.value >= 0) store.updateHost(editIndex.value, { ...form })
  else store.addHost({ ...form })
  showModal.value = false
}
</script>
