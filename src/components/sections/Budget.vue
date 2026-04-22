<template>
  <SectionCard icon="fas fa-calculator" :title="t('budget')">
    <div class="overflow-x-auto">
      <table class="budget-table">
        <thead>
          <tr>
            <th>{{ t('category') }}</th>
            <th>{{ t('amount') }}</th>
            <th>{{ t('spent') }}</th>
            <th>{{ t('note') }}</th>
            <th>{{ t('action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.budget.length === 0">
            <td colspan="5" class="text-center" style="color: var(--text-secondary);">{{ t('noBudget') }}</td>
          </tr>
          <tr v-for="(b, i) in store.budget" :key="i">
            <td>{{ categoryLabel(b.category) }}</td>
            <td class="amount">${{ b.amount?.toLocaleString() }}</td>
            <td>
              <input type="number" class="form-input" style="width: 100px; padding: 0.5rem;" :value="b.spent || 0" @change="store.updateBudgetSpent(i, $event.target.value)">
            </td>
            <td>
              <input type="text" class="form-input" style="width: 150px; padding: 0.5rem; font-size: 0.85rem;" :value="b.note || ''" :placeholder="t('addNote') + '...'" @change="store.updateBudgetNote(i, $event.target.value)">
            </td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="editBudget(i)"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary btn-sm" @click="store.deleteBudget(i)"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2">{{ t('totalLabel') }}</td>
            <td class="amount">${{ store.totalBudgetAmount.toLocaleString() }}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <button class="btn btn-secondary mt-4" @click="openAdd"><i class="fas fa-plus"></i> {{ t('addBudget') }}</button>

    <BaseModal v-model="showModal" :title="t('addBudget')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('category') }}</label>
          <select class="form-select" v-model="form.category">
            <option value="travel">{{ t('travel') }}</option>
            <option value="food">{{ t('food') }}</option>
            <option value="printing">{{ t('printing') }}</option>
            <option value="souvenirs">{{ t('souvenirs') }}</option>
            <option value="rental">{{ t('rental') }}</option>
            <option value="marketing">{{ t('marketing') }}</option>
            <option value="other">{{ t('other') }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('amount') }}</label>
          <input class="form-input" type="number" v-model="form.amount" placeholder="0">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('note') }}</label>
          <input class="form-input" type="text" v-model="form.note" placeholder="备注信息">
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

const store = useLabStore()
const { t } = useI18n()
const showModal = ref(false)
const editIndex = ref(-1)
const form = reactive({ category: 'other', amount: '', note: '' })

function categoryLabel(c) {
  const map = { travel: t('travel'), food: t('food'), printing: t('printing'), souvenirs: t('souvenirs'), rental: t('rental'), marketing: t('marketing'), other: t('other') }
  return map[c] || c
}
function openAdd() { editIndex.value = -1; Object.assign(form, { category: 'other', amount: '', note: '' }); showModal.value = true }
function editBudget(i) { editIndex.value = i; Object.assign(form, { category: store.budget[i].category, amount: store.budget[i].amount, note: store.budget[i].note || '' }); showModal.value = true }
function save() {
  if (!form.amount || form.amount <= 0) { alert(t('enterValidAmount')); return }
  if (editIndex.value >= 0) store.updateBudget(editIndex.value, { ...form, amount: parseFloat(form.amount) })
  else store.addBudget({ ...form, amount: parseFloat(form.amount), spent: 0 })
  showModal.value = false
}
</script>
