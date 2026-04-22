<template>
  <SectionCard icon="fas fa-address-book" :title="t('guestManagement')">
    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ t(tab.key) }}</button>
    </div>

    <!-- Guest List -->
    <div v-show="activeTab === 'list'">
      <div class="flex flex-col gap-3">
        <EmptyState v-if="store.guests.length === 0" icon="fas fa-users" :message="t('noGuestInfo')" />
        <div v-for="(g, i) in store.guests" :key="i" class="list-item">
          <div class="list-item-content">
            <div class="list-item-title">{{ g.name }}</div>
            <div class="list-item-subtitle">{{ g.title }} {{ g.bio ? '- ' + g.bio : '' }}</div>
            <div class="list-item-meta">
              <span class="badge" :class="typeBadge(g.type)">{{ typeLabel(g.type) }}</span>
              <span class="meta-tag"><i class="fas fa-envelope"></i> {{ g.email || t('noEmail') }}</span>
            </div>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-secondary btn-icon" @click="editGuest(i)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-secondary btn-icon" @click="store.deleteGuest(i)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
      <button class="btn btn-secondary mt-4" @click="openAdd"><i class="fas fa-plus"></i> {{ t('addGuest') }}</button>
    </div>

    <!-- Import -->
    <div v-show="activeTab === 'import'">
      <div class="import-section">
        <i class="fas fa-file-import text-4xl mb-3 block" style="color: var(--accent-cyan);"></i>
        <p style="color: var(--text-secondary);" class="mb-3">{{ t('dragFileHere') }}</p>
        <input type="file" ref="fileImportInput" accept=".csv,.xlsx,.txt" class="hidden" @change="handleFileImport">
        <button class="btn btn-primary" @click="fileImportInput.click()"><i class="fas fa-upload"></i> {{ t('chooseFile') }}</button>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <label class="form-label">{{ t('pasteEmailList') }}</label>
        <textarea class="form-textarea" v-model="emailPaste" placeholder="email1@example.com&#10;email2@example.com"></textarea>
        <button class="btn btn-cyan mt-3 self-start" @click="importEmails"><i class="fas fa-plus"></i> {{ t('importEmail') }}</button>
      </div>
      <div v-if="importPreview.length > 0" class="mt-4 flex flex-col gap-2">
        <div v-for="e in importPreview" :key="e" class="list-item" style="padding: 0.5rem 0.75rem;">
          <span><i class="fas fa-envelope mr-2" style="color: var(--accent-cyan);"></i>{{ e }}</span>
        </div>
        <button class="btn btn-cyan mt-2 self-start" @click="confirmImport">
          <i class="fas fa-user-plus"></i> {{ t('importCount').replace('{n}', importPreview.length) }}
        </button>
      </div>
    </div>

    <!-- Email -->
    <div v-show="activeTab === 'email'">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('emailSubjectLabel') }}</label>
          <input class="form-input" type="text" v-model="emailSubject" placeholder="MAGIKID Lab 开业典礼邀请函">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('emailPreviewLabel') }}</label>
          <div class="email-preview" ref="emailPreviewEl">
            <div class="text-center pb-4 mb-4" style="border-bottom: 2px solid var(--accent-cyan);">
              <div class="text-2xl font-bold tracking-wide uppercase" style="color: var(--accent-cyan);">MAGIKID</div>
              <p>诚挚邀请您参加开业典礼</p>
            </div>
            <p>尊敬的 [嘉宾姓名]，</p>
            <p>我们非常荣幸地邀请您参加 <strong>{{ store.lab.name }} 开业典礼</strong>。</p>
            <p><strong>日期：</strong>{{ store.lab.openingDate }}</p>
            <p><strong>地点：</strong>{{ store.lab.address }}</p>
            <p>届时将有精彩的活动安排，期待您的光临！</p>
            <p>此致</p>
            <p><strong>MAGIKID Team</strong></p>
          </div>
        </div>
        <button class="btn btn-primary self-start" @click="copyEmailTemplate"><i class="fas fa-copy"></i> {{ t('copyEmailTemplate') }}</button>
      </div>
    </div>

    <!-- Guest Modal -->
    <BaseModal v-model="showModal" :title="t('addGuest')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('name') }}</label>
          <input class="form-input" type="text" v-model="form.name" placeholder="嘉宾姓名">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('title') }}</label>
          <input class="form-input" type="text" v-model="form.title" placeholder="如：市长、议员等">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('email') }}</label>
          <input class="form-input" type="email" v-model="form.email" placeholder="email@example.com">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('bio') }}</label>
          <textarea class="form-textarea" v-model="form.bio" placeholder="嘉宾简介..."></textarea>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('type') }}</label>
          <select class="form-select" v-model="form.type">
            <option value="vip">VIP（政商名流）</option>
            <option value="speaker">{{ t('speaker') }}</option>
            <option value="media">{{ t('media') }}</option>
            <option value="parent">{{ t('parent') }}</option>
            <option value="other">{{ t('other') }}</option>
          </select>
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

const activeTab = ref('list')
const tabs = [
  { id: 'list', key: 'guestList' },
  { id: 'import', key: 'guestImport' },
  { id: 'email', key: 'guestEmail' },
]

const showModal = ref(false)
const editIndex = ref(-1)
const form = reactive({ name: '', title: '', email: '', bio: '', type: 'vip' })

const emailSubject = ref('MAGIKID Lab 开业典礼邀请函')
const emailPaste = ref('')
const importPreview = ref([])
const fileImportInput = ref(null)
const emailPreviewEl = ref(null)

const typeBadgeMap = { vip: 'badge-gold', speaker: 'badge-cyan', media: 'badge-warning', parent: 'badge-success', other: '' }
function typeBadge(type) { return typeBadgeMap[type] || '' }
function typeLabel(type) {
  const map = { vip: 'VIP', speaker: t('speaker'), media: t('media'), parent: t('parent'), other: t('other') }
  return map[type] || t('other')
}

function openAdd() { editIndex.value = -1; Object.assign(form, { name: '', title: '', email: '', bio: '', type: 'vip' }); showModal.value = true }
function editGuest(i) { editIndex.value = i; Object.assign(form, store.guests[i]); showModal.value = true }
function save() {
  if (!form.name) { alert(t('enterName')); return }
  if (editIndex.value >= 0) store.updateGuest(editIndex.value, { ...form })
  else store.addGuest({ ...form })
  showModal.value = false
}

function handleFileImport(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const emails = ev.target.result.split(/[\n,;]/).filter(e => e.trim() && e.includes('@'))
    emailPaste.value = emails.join('\n')
    alert(`检测到 ${emails.length} 个邮箱地址`)
  }
  reader.readAsText(file)
}

function importEmails() {
  const emails = emailPaste.value.split('\n').filter(e => e.trim() && e.includes('@'))
  if (emails.length === 0) { alert('未找到有效的邮箱地址'); return }
  importPreview.value = emails.map(e => e.trim())
}

function confirmImport() {
  importPreview.value.forEach(email => {
    store.addGuest({ name: email.split('@')[0], title: '', email, bio: '', type: 'other' })
  })
  alert(t('importSuccess').replace('{n}', importPreview.value.length))
  emailPaste.value = ''
  importPreview.value = []
}

function copyEmailTemplate() {
  const text = emailPreviewEl.value?.innerText || ''
  navigator.clipboard.writeText(text).then(() => alert(t('emailCopied')))
}
</script>
