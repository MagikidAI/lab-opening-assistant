<template>
  <SectionCard icon="fas fa-hashtag" :title="t('socialMedia')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-2">
        <label class="form-label">Instagram</label>
        <input class="form-input" type="text" v-model="social.instagram" @change="store.saveSocial(social)" placeholder="@magikidlab">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">Facebook</label>
        <input class="form-input" type="text" v-model="social.facebook" @change="store.saveSocial(social)" placeholder="MAGIKID Lab">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">YouTube</label>
        <input class="form-input" type="text" v-model="social.youtube" @change="store.saveSocial(social)" placeholder="MAGIKID Channel">
      </div>
      <div class="flex flex-col gap-2">
        <label class="form-label">{{ t('xiaohongshu') }}</label>
        <input class="form-input" type="text" v-model="social.xiaohongshu" @change="store.saveSocial(social)" placeholder="@magikid">
      </div>
    </div>

    <div class="flex flex-col gap-2 mt-6">
      <label class="form-label">{{ t('postPlan') }}</label>
      <div class="flex flex-col gap-3">
        <p v-if="store.socialPosts.length === 0" class="text-sm" style="color: var(--text-muted);">{{ t('noSocialPost') }}</p>
        <div v-for="(p, i) in store.socialPosts" :key="i" class="list-item" style="padding: 0.75rem 1rem;">
          <div class="list-item-content">
            <div class="list-item-title">{{ p.date || t('dateTBD') }} <i :class="platformIcon(p.platform)"></i></div>
            <div class="list-item-subtitle">{{ p.content || t('contentTBD') }}</div>
          </div>
          <div class="list-item-actions">
            <button class="btn btn-secondary btn-icon btn-sm" @click="editPost(i)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-secondary btn-icon btn-sm" @click="store.deleteSocialPost(i)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm mt-3 self-start" @click="openAdd"><i class="fas fa-plus"></i> {{ t('addPost') }}</button>
    </div>

    <BaseModal v-model="showModal" :title="t('addPost')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="save">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('postDate') }}</label><LocaleDatePicker v-model="form.date" /></div>
        <div class="flex flex-col gap-2">
          <label class="form-label">{{ t('platform') }}</label>
          <select class="form-select" v-model="form.platform">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="xiaohongshu">{{ t('xiaohongshu') }}</option>
            <option value="all">{{ t('allPlatforms') }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('postContent') }}</label><textarea class="form-textarea" v-model="form.content" :placeholder="t('postContentPlaceholder')"></textarea></div>
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
import LocaleDatePicker from '@/components/shared/LocaleDatePicker.vue'

const store = useLabStore()
const { t } = useI18n()
const social = reactive({ ...store.social })
watch(() => store.social, val => Object.assign(social, val), { deep: true })

const showModal = ref(false)
const editIndex = ref(-1)
const form = reactive({ date: '', platform: 'all', content: '' })

const platformIcons = { instagram: 'fab fa-instagram', facebook: 'fab fa-facebook', youtube: 'fab fa-youtube', xiaohongshu: 'fas fa-book', all: 'fas fa-globe' }
function platformIcon(p) { return platformIcons[p] || 'fas fa-globe' }

function openAdd() { editIndex.value = -1; Object.assign(form, { date: '', platform: 'all', content: '' }); showModal.value = true }
function editPost(i) { editIndex.value = i; Object.assign(form, store.socialPosts[i]); showModal.value = true }
function save() {
  if (editIndex.value >= 0) store.updateSocialPost(editIndex.value, { ...form })
  else store.addSocialPost({ ...form })
  showModal.value = false
}
</script>
