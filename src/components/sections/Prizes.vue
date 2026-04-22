<template>
  <SectionCard icon="fas fa-gift" :title="t('prizes')">
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ t(tab.key) }}</button>
    </div>

    <!-- Prizes -->
    <div v-show="activeTab === 'prizes'">
      <div class="flex flex-col gap-3">
        <EmptyState v-if="store.prizes.length === 0" icon="fas fa-gift" :message="t('noPrizes')" />
        <div v-for="(p, i) in store.prizes" :key="i" class="list-item">
          <div class="list-item-content">
            <div class="list-item-title">{{ p.name }}</div>
            <div class="list-item-meta">
              <span class="badge" :class="levelBadge(p.level)">{{ levelLabel(p.level) }}</span>
              <span class="meta-tag">x{{ p.quantity || 1 }}</span>
            </div>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-secondary btn-icon" @click="editPrize(i)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-secondary btn-icon" @click="store.deletePrize(i)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
      <button class="btn btn-secondary mt-4" @click="openAdd"><i class="fas fa-plus"></i> {{ t('addPrize') }}</button>
    </div>

    <!-- Discounts -->
    <div v-show="activeTab === 'discount'">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('discountType') }}</label>
          <input class="form-input" type="text" v-model="discounts.type" @change="store.saveDiscounts(discounts)">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('discountAmount') }}</label>
          <input class="form-input" type="text" v-model="discounts.amount" @change="store.saveDiscounts(discounts)">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('discountValid') }}</label>
          <input class="form-input" type="text" v-model="discounts.valid" @change="store.saveDiscounts(discounts)">
        </div>
      </div>
    </div>

    <BaseModal v-model="showModal" :title="t('addPrize')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('prizeName') }}</label>
          <input class="form-input" type="text" v-model="form.name" placeholder="如：免费夏令营一天">
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('prizeType') }}</label>
          <select class="form-select" v-model="form.type">
            <option value="raffle">{{ t('raffle') }}</option>
            <option value="competition">{{ t('competition') }}</option>
            <option value="special">{{ t('special') }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('prizeLevel') }}</label>
          <select class="form-select" v-model="form.level">
            <option value="grand">{{ t('grand') }}</option>
            <option value="first">{{ t('first') }}</option>
            <option value="second">{{ t('second') }}</option>
            <option value="third">{{ t('third') }}</option>
            <option value="participation">{{ t('participation') }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('quantity') }}</label>
          <input class="form-input" type="number" v-model="form.quantity" value="1">
        </div>
      </div>
    </BaseModal>
  </SectionCard>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const store = useLabStore()
const { t } = useI18n()
const activeTab = ref('prizes')
const tabs = [{ id: 'prizes', key: 'rafflePrizesTab' }, { id: 'discount', key: 'discountTab' }]
const showModal = ref(false)
const editIndex = ref(-1)
const form = reactive({ name: '', type: 'raffle', level: 'participation', quantity: 1 })
const discounts = reactive({ ...store.discounts })
watch(() => store.discounts, val => Object.assign(discounts, val), { deep: true })

const levelBadgeMap = { grand: 'badge-gold', first: 'badge-cyan', second: 'badge-success', third: 'badge-warning', participation: '' }
function levelBadge(l) { return levelBadgeMap[l] || '' }
function levelLabel(l) {
  const map = { grand: t('grand'), first: t('first'), second: t('second'), third: t('third'), participation: t('participation') }
  return map[l] || l
}
function openAdd() { editIndex.value = -1; Object.assign(form, { name: '', type: 'raffle', level: 'participation', quantity: 1 }); showModal.value = true }
function editPrize(i) { editIndex.value = i; Object.assign(form, store.prizes[i]); showModal.value = true }
function save() {
  if (!form.name) { alert(t('enterPrizeName')); return }
  if (editIndex.value >= 0) store.updatePrize(editIndex.value, { ...form })
  else store.addPrize({ ...form })
  showModal.value = false
}
</script>
