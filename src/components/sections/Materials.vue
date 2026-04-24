<template>
  <SectionCard icon="fas fa-photo-video" :title="t('materials')">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Posters -->
      <div>
        <h4 class="font-bold mb-4"><i class="fas fa-image mr-2" style="color: var(--accent-gold);"></i>{{ t('poster') }}</h4>
        <div class="flex flex-col gap-2">
          <p v-if="store.posters.length === 0" class="text-sm" style="color: var(--text-muted);">{{ t('noPoster') }}</p>
          <div v-for="(p, i) in store.posters" :key="i" class="list-item" style="padding: 0.5rem 0.75rem;">
            <div class="list-item-content">
              <div class="list-item-title text-sm">{{ p.name }}</div>
              <a v-if="p.url" :href="p.url" target="_blank" class="text-xs" style="color: var(--accent-cyan);">{{ p.url }}</a>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon btn-sm" @click="editPoster(i)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-secondary btn-icon btn-sm" @click="store.deletePoster(i)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-3" @click="openModal('poster')"><i class="fas fa-plus"></i> {{ t('addPoster') }}</button>
      </div>
      <!-- Videos -->
      <div>
        <h4 class="font-bold mb-4"><i class="fas fa-video mr-2" style="color: var(--accent-cyan);"></i>{{ t('video') }}</h4>
        <div class="flex flex-col gap-2">
          <p v-if="store.videos.length === 0" class="text-sm" style="color: var(--text-muted);">{{ t('noVideo') }}</p>
          <div v-for="(v, i) in store.videos" :key="i" class="list-item" style="padding: 0.5rem 0.75rem;">
            <div class="list-item-content">
              <div class="list-item-title text-sm">{{ v.name }}</div>
              <a v-if="v.url" :href="v.url" target="_blank" class="text-xs" style="color: var(--accent-cyan);">{{ v.url }}</a>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon btn-sm" @click="editVideo(i)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-secondary btn-icon btn-sm" @click="store.deleteVideo(i)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-3" @click="openModal('video')"><i class="fas fa-plus"></i> {{ t('addVideo') }}</button>
      </div>
      <!-- Banners -->
      <div>
        <h4 class="font-bold mb-4"><i class="fas fa-chalkboard mr-2" style="color: var(--color-warning);"></i>{{ t('banner') }}</h4>
        <div class="flex flex-col gap-2">
          <p v-if="store.banners.length === 0" class="text-sm" style="color: var(--text-muted);">{{ t('noBanner') }}</p>
          <div v-for="(b, i) in store.banners" :key="i" class="list-item" style="padding: 0.5rem 0.75rem;">
            <div class="list-item-content">
              <div class="list-item-title text-sm">{{ b.name }}</div>
              <div class="list-item-subtitle text-xs">{{ b.location }}</div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon btn-sm" @click="editBanner(i)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-secondary btn-icon btn-sm" @click="store.deleteBanner(i)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-3" @click="openModal('banner')"><i class="fas fa-plus"></i> {{ t('addBanner') }}</button>
      </div>
    </div>

    <!-- Poster Modal -->
    <BaseModal v-model="modals.poster" :title="t('addPoster')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="savePoster">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('posterName') }}</label><input class="form-input" type="text" v-model="forms.poster.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('urlPath') }}</label><input class="form-input" type="text" v-model="forms.poster.url" placeholder="https://..."></div>
      </div>
    </BaseModal>
    <!-- Video Modal -->
    <BaseModal v-model="modals.video" :title="t('addVideo')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveVideo">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('videoName') }}</label><input class="form-input" type="text" v-model="forms.video.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('videoUrl') }}</label><input class="form-input" type="text" v-model="forms.video.url" placeholder="https://..."></div>
      </div>
    </BaseModal>
    <!-- Banner Modal -->
    <BaseModal v-model="modals.banner" :title="t('addBanner')" :confirmText="t('add')" :cancelText="t('cancel')" @confirm="saveBanner">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('bannerName') }}</label><input class="form-input" type="text" v-model="forms.banner.name"></div>
        <div class="flex flex-col gap-2"><label class="form-label">{{ t('location') }}</label><input class="form-input" type="text" v-model="forms.banner.location" :placeholder="t('bannerLocationPlaceholder')"></div>
      </div>
    </BaseModal>
  </SectionCard>
</template>

<script setup>
import { reactive } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import SectionCard from '@/components/shared/SectionCard.vue'
import BaseModal from '@/components/shared/BaseModal.vue'

const store = useLabStore()
const { t } = useI18n()
const modals = reactive({ poster: false, video: false, banner: false })
const editIndexes = reactive({ poster: -1, video: -1, banner: -1 })
const forms = reactive({
  poster: { name: '', url: '' },
  video: { name: '', url: '' },
  banner: { name: '', location: '' },
})

function openModal(type) { editIndexes[type] = -1; Object.assign(forms[type], type === 'banner' ? { name: '', location: '' } : { name: '', url: '' }); modals[type] = true }
function editPoster(i) { editIndexes.poster = i; Object.assign(forms.poster, store.posters[i]); modals.poster = true }
function editVideo(i) { editIndexes.video = i; Object.assign(forms.video, store.videos[i]); modals.video = true }
function editBanner(i) { editIndexes.banner = i; Object.assign(forms.banner, store.banners[i]); modals.banner = true }

function savePoster() {
  if (!forms.poster.name) { alert(t('enterPosterName')); modals.poster = true; return }
  if (editIndexes.poster >= 0) store.updatePoster(editIndexes.poster, { ...forms.poster })
  else store.addPoster({ ...forms.poster })
  modals.poster = false
}
function saveVideo() {
  if (!forms.video.name) { alert(t('enterVideoName')); modals.video = true; return }
  if (editIndexes.video >= 0) store.updateVideo(editIndexes.video, { ...forms.video })
  else store.addVideo({ ...forms.video })
  modals.video = false
}
function saveBanner() {
  if (!forms.banner.name) { alert(t('enterBannerName')); modals.banner = true; return }
  if (editIndexes.banner >= 0) store.updateBanner(editIndexes.banner, { ...forms.banner })
  else store.addBanner({ ...forms.banner })
  modals.banner = false
}
</script>
