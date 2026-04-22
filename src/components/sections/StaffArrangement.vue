<template>
  <SectionCard icon="fas fa-users-cog" :title="t('staffArrangement')">
    <!-- Chief & Host -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
      <div class="flex flex-col gap-2">
        <label class="form-label"><i class="fas fa-crown mr-1" style="color: var(--accent-gold);"></i> {{ t('chiefLead') }}</label>
        <StaffInput v-model="staff.chiefLead" placeholder="负责人姓名" :staffList="store.availableStaff" @change="store.saveStaff(staff)" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label"><i class="fas fa-microphone mr-1" style="color: var(--accent-cyan);"></i> {{ t('host') }}</label>
        <StaffInput v-model="staff.host" placeholder="主持人姓名" :staffList="store.availableStaff" @change="store.saveStaff(staff)" />
      </div>
    </div>

    <!-- Project Leads -->
    <SubList :title="t('projectLeadTitle')" :items="store.leads" :emptyMsg="t('noLeads')"
      @add="openModal('lead')" @edit="(i) => editModal('lead', i)" @delete="(i) => store.deleteLead(i)" />

    <!-- Reception -->
    <SubList :title="t('receptionTitle')" :items="store.reception" :emptyMsg="t('noReception')"
      @add="openModal('reception')" @edit="(i) => editModal('reception', i)" @delete="(i) => store.deleteReception(i)" style="margin-top: 1.5rem;" />

    <!-- VIP -->
    <SubList :title="t('vipReception')" :items="store.vips" :emptyMsg="t('noVIP')"
      @add="openModal('vip')" @edit="(i) => editModal('vip', i)" @delete="(i) => store.deleteVIP(i)" style="margin-top: 1.5rem;" />

    <!-- Raffle Hosts -->
    <SubList :title="t('raffleHost')" :items="store.raffleHosts" :emptyMsg="t('noRaffleGuest')"
      @add="openModal('raffle')" @edit="(i) => editModal('raffle', i)" @delete="(i) => store.deleteRaffleHost(i)" style="margin-top: 1.5rem;" />

    <!-- Lead Modal -->
    <BaseModal v-model="showLeadModal" :title="t('addLeadTitle')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveLead">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('name') }}</label>
          <StaffInput v-model="forms.lead.name" :staffList="store.availableStaff" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('roleLabel') }}</label>
          <input class="form-input" type="text" v-model="forms.lead.role">
        </div>
      </div>
    </BaseModal>

    <!-- Reception Modal -->
    <BaseModal v-model="showReceptionModal" :title="t('addReception')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveReception">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('name') }}</label>
          <StaffInput v-model="forms.reception.name" :staffList="store.availableStaff" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('roleLabel') }}</label>
          <input class="form-input" type="text" v-model="forms.reception.role">
        </div>
      </div>
    </BaseModal>

    <!-- VIP Modal -->
    <BaseModal v-model="showVipModal" :title="t('addVIP')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveVIP">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('vipName') }}</label>
          <input class="form-input" type="text" v-model="forms.vip.name">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('vipHandler') }}</label>
          <StaffInput v-model="forms.vip.handler" :staffList="store.availableStaff" />
        </div>
      </div>
    </BaseModal>

    <!-- Raffle Modal -->
    <BaseModal v-model="showRaffleModal" :title="t('addRaffleGuest')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveRaffle">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('guestNameLabel') }}</label>
          <StaffInput v-model="forms.raffle.name" :staffList="store.availableStaff" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('title') }}</label>
          <input class="form-input" type="text" v-model="forms.raffle.title">
        </div>
      </div>
    </BaseModal>
  </SectionCard>
</template>

<script setup>
import { reactive, ref, watch, defineComponent, computed } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'
import BaseModal from '@/components/shared/BaseModal.vue'

const store = useLabStore()
const { t } = useI18n()

const staff = reactive({ ...store.staff })
watch(() => store.staff, val => Object.assign(staff, val), { deep: true })

const modals = reactive({ lead: false, reception: false, vip: false, raffle: false })
const editIndexes = reactive({ lead: -1, reception: -1, vip: -1, raffle: -1 })
const forms = reactive({
  lead: { name: '', role: '' },
  reception: { name: '', role: '' },
  vip: { name: '', handler: '' },
  raffle: { name: '', title: '' },
})

const showLeadModal = computed({
  get: () => modals.lead,
  set: (v) => { modals.lead = v }
})
const showReceptionModal = computed({
  get: () => modals.reception,
  set: (v) => { modals.reception = v }
})
const showVipModal = computed({
  get: () => modals.vip,
  set: (v) => { modals.vip = v }
})
const showRaffleModal = computed({
  get: () => modals.raffle,
  set: (v) => { modals.raffle = v }
})

function openModal(type) {
  editIndexes[type] = -1
  Object.assign(forms[type], type === 'vip' ? { name: '', handler: '' } : type === 'raffle' ? { name: '', title: '' } : { name: '', role: '' })
  modals[type] = true
}
function editModal(type, i) {
  editIndexes[type] = i
  const items = type === 'lead' ? store.leads : type === 'reception' ? store.reception : type === 'vip' ? store.vips : store.raffleHosts
  Object.assign(forms[type], items[i])
  modals[type] = true
}
function saveLead() {
  if (!forms.lead.name) { alert(t('enterName')); modals.lead = true; return }
  if (editIndexes.lead >= 0) store.updateLead(editIndexes.lead, { ...forms.lead })
  else store.addLead({ ...forms.lead })
  modals.lead = false
}
function saveReception() {
  if (!forms.reception.name) { alert(t('enterName')); modals.reception = true; return }
  if (editIndexes.reception >= 0) store.updateReception(editIndexes.reception, { ...forms.reception })
  else store.addReception({ ...forms.reception })
  modals.reception = false
}
function saveVIP() {
  if (!forms.vip.name) { alert(t('enterVIPName')); modals.vip = true; return }
  if (editIndexes.vip >= 0) store.updateVIP(editIndexes.vip, { ...forms.vip })
  else store.addVIP({ ...forms.vip })
  modals.vip = false
}
function saveRaffle() {
  if (!forms.raffle.name) { alert(t('enterGuestName')); modals.raffle = true; return }
  if (editIndexes.raffle >= 0) store.updateRaffleHost(editIndexes.raffle, { ...forms.raffle })
  else store.addRaffleHost({ ...forms.raffle })
  modals.raffle = false
}
</script>

<script>
import { h, ref, computed } from 'vue'

// ---- StaffInput: self-contained staff picker input ----
const StaffInput = {
  props: {
    modelValue: { type: String, default: '' },
    staffList: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const open = ref(false)
    const wrapRef = ref(null)

    const filtered = computed(() => {
      const q = (props.modelValue || '').toLowerCase()
      if (!q) return props.staffList
      return props.staffList.filter(s =>
        s.name.toLowerCase().includes(q) || String(s.uid || '').toLowerCase().includes(q)
      )
    })

    function onInput(e) {
      emit('update:modelValue', e.target.value)
      open.value = true
    }
    function onFocus() { open.value = true }
    function onBlur() { setTimeout(() => { open.value = false }, 150) }
    function select(s) {
      emit('update:modelValue', s.name)
      emit('change')
      open.value = false
    }

    return () => h('div', { class: 'staff-picker-wrap', ref: wrapRef }, [
      h('input', {
        class: 'form-input',
        type: 'text',
        value: props.modelValue,
        placeholder: props.placeholder,
        autocomplete: 'off',
        onInput,
        onFocus,
        onBlur,
        onChange: () => emit('change'),
      }),
      (open.value && filtered.value.length)
        ? h('div', { class: 'staff-dropdown' },
            filtered.value.map(s =>
              h('div', {
                class: 'staff-dropdown-item',
                onMousedown: (e) => { e.preventDefault(); select(s) }
              }, [
                h('span', { class: 'staff-name' }, s.name),
                h('span', { class: 'staff-uid' }, s.uid || ''),
              ])
            )
          )
        : null
    ])
  }
}

// ---- SubList ----
import { h as hh } from 'vue'
const SubList = {
  props: ['title', 'items', 'emptyMsg'],
  emits: ['add', 'edit', 'delete'],
  setup(props, { emit }) {
    return () => hh('div', [
      hh('h4', { style: 'margin-bottom: 1rem; color: var(--text-secondary);' }, props.title),
      props.items.length === 0
        ? hh('p', { style: 'color: var(--text-muted); font-size: 0.875rem;' }, props.emptyMsg)
        : props.items.map((item, i) => hh('div', {
            class: 'list-item', style: 'padding: 0.75rem 1rem; margin-bottom: 0.5rem;'
          }, [
            hh('div', { class: 'list-item-content' }, [
              hh('div', { class: 'list-item-title' }, item.name),
              hh('div', { class: 'list-item-subtitle' }, item.role || item.handler || item.title || ''),
            ]),
            hh('div', { class: 'list-item-actions' }, [
              hh('button', { class: 'btn btn-secondary btn-icon', onClick: () => emit('edit', i) }, hh('i', { class: 'fas fa-edit' })),
              hh('button', { class: 'btn btn-secondary btn-icon', onClick: () => emit('delete', i) }, hh('i', { class: 'fas fa-trash' })),
            ])
          ])),
      hh('button', { class: 'btn btn-secondary btn-sm mt-3', onClick: () => emit('add') }, [
        hh('i', { class: 'fas fa-plus' }),
        ' 添加'
      ])
    ])
  }
}

export default { components: { SubList, StaffInput } }
</script>

<style scoped>
.staff-picker-wrap {
  position: relative;
}
.staff-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--card-bg, #1e2a3a);
  border: 1px solid var(--border-color, rgba(255,255,255,0.1));
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  max-height: 200px;
  overflow-y: auto;
}
.staff-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  gap: 0.5rem;
}
.staff-dropdown-item:first-child { border-radius: 8px 8px 0 0; }
.staff-dropdown-item:last-child  { border-radius: 0 0 8px 8px; }
.staff-dropdown-item:hover { background: rgba(212,168,83,0.15); }
.staff-name { font-size: 0.9rem; color: var(--text-primary, #e8e8e8); font-weight: 500; }
.staff-uid  { font-size: 0.75rem; color: var(--text-muted, #888); font-family: monospace; }
</style>


