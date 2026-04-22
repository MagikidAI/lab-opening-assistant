<template>
  <SectionCard icon="fas fa-users-cog" :title="t('staffArrangement')">
    <!-- Chief & Host -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
      <div class="flex flex-col gap-2">
        <label class="form-label"><i class="fas fa-crown mr-1" style="color: var(--accent-gold);"></i> {{ t('chiefLead') }}</label>
        <input class="form-input" type="text" v-model="staff.chiefLead" @change="store.saveStaff(staff)" placeholder="负责人姓名">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label"><i class="fas fa-microphone mr-1" style="color: var(--accent-cyan);"></i> {{ t('host') }}</label>
        <input class="form-input" type="text" v-model="staff.host" @change="store.saveStaff(staff)" placeholder="主持人姓名">
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
    <BaseModal v-model="modals.lead" :title="t('addLeadTitle')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveLead">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('name') }}</label><input class="form-input" type="text" v-model="forms.lead.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('roleLabel') }}</label><input class="form-input" type="text" v-model="forms.lead.role"></div>
      </div>
    </BaseModal>

    <!-- Reception Modal -->
    <BaseModal v-model="modals.reception" :title="t('addReception')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveReception">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('name') }}</label><input class="form-input" type="text" v-model="forms.reception.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('roleLabel') }}</label><input class="form-input" type="text" v-model="forms.reception.role"></div>
      </div>
    </BaseModal>

    <!-- VIP Modal -->
    <BaseModal v-model="modals.vip" :title="t('addVIP')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveVIP">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('vipName') }}</label><input class="form-input" type="text" v-model="forms.vip.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('vipHandler') }}</label><input class="form-input" type="text" v-model="forms.vip.handler"></div>
      </div>
    </BaseModal>

    <!-- Raffle Modal -->
    <BaseModal v-model="modals.raffle" :title="t('addRaffleGuest')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveRaffle">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('guestNameLabel') }}</label><input class="form-input" type="text" v-model="forms.raffle.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('title') }}</label><input class="form-input" type="text" v-model="forms.raffle.title"></div>
      </div>
    </BaseModal>
  </SectionCard>
</template>

<script setup>
import { reactive, watch } from 'vue'
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
  if (!forms.lead.name) { alert(t('enterName')); return }
  if (editIndexes.lead >= 0) store.updateLead(editIndexes.lead, { ...forms.lead })
  else store.addLead({ ...forms.lead })
  modals.lead = false
}
function saveReception() {
  if (!forms.reception.name) { alert(t('enterName')); return }
  if (editIndexes.reception >= 0) store.updateReception(editIndexes.reception, { ...forms.reception })
  else store.addReception({ ...forms.reception })
  modals.reception = false
}
function saveVIP() {
  if (!forms.vip.name) { alert(t('enterVIPName')); return }
  if (editIndexes.vip >= 0) store.updateVIP(editIndexes.vip, { ...forms.vip })
  else store.addVIP({ ...forms.vip })
  modals.vip = false
}
function saveRaffle() {
  if (!forms.raffle.name) { alert(t('enterGuestName')); return }
  if (editIndexes.raffle >= 0) store.updateRaffleHost(editIndexes.raffle, { ...forms.raffle })
  else store.addRaffleHost({ ...forms.raffle })
  modals.raffle = false
}
</script>

<script>
// SubList as local component
import { h } from 'vue'
const SubList = {
  props: ['title', 'items', 'emptyMsg'],
  emits: ['add', 'edit', 'delete'],
  setup(props, { emit }) {
    return () => h('div', [
      h('h4', { style: 'margin-bottom: 1rem; color: var(--text-secondary);' }, props.title),
      props.items.length === 0
        ? h('p', { style: 'color: var(--text-muted); font-size: 0.875rem;' }, props.emptyMsg)
        : props.items.map((item, i) => h('div', {
            class: 'list-item', style: 'padding: 0.75rem 1rem; margin-bottom: 0.5rem;'
          }, [
            h('div', { class: 'list-item-content' }, [
              h('div', { class: 'list-item-title' }, item.name),
              h('div', { class: 'list-item-subtitle' }, item.role || item.handler || item.title || ''),
            ]),
            h('div', { class: 'list-item-actions' }, [
              h('button', { class: 'btn btn-secondary btn-icon', onClick: () => emit('edit', i) }, h('i', { class: 'fas fa-edit' })),
              h('button', { class: 'btn btn-secondary btn-icon', onClick: () => emit('delete', i) }, h('i', { class: 'fas fa-trash' })),
            ])
          ])),
      h('button', { class: 'btn btn-secondary btn-sm mt-3', onClick: () => emit('add') }, [
        h('i', { class: 'fas fa-plus' }),
        ' 添加'
      ])
    ])
  }
}
export default { components: { SubList } }
</script>
