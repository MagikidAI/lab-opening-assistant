<template>
  <SectionCard icon="fas fa-building" :title="t('labBasicInfo')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('labName') }}</label>
        <input class="form-input" type="text" v-model="lab.name" @change="store.saveLab(lab)" :placeholder="t('labName')">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('openingDate') }}</label>
        <LocaleDatePicker v-model="lab.openingDate" @change="store.saveLab(lab)" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('labPhone') }}</label>
        <input class="form-input" type="tel" v-model="lab.phone" @change="store.saveLab(lab)" :placeholder="t('phonePlaceholder')">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('labAddress') }}</label>
        <input class="form-input" type="text" v-model="lab.address" @change="store.saveLab(lab)" :placeholder="t('addressPlaceholder')">
      </div>
    </div>
  </SectionCard>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'
import LocaleDatePicker from '@/components/shared/LocaleDatePicker.vue'

const store = useLabStore()
const { t } = useI18n()

const lab = reactive({ ...store.lab })
watch(() => store.lab, (val) => Object.assign(lab, val), { deep: true })
</script>
