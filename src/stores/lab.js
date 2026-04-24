import { defineStore } from 'pinia'
import axios from 'axios'
import { getLasVegasData } from '@/data/presets.js'
import { translations } from '@/data/translations.js'

const STORAGE_KEY = 'magikidLabAssistant'

function getCurrentLang() {
  try {
    return localStorage.getItem('magikidLabLang') || 'zh'
  } catch {
    return 'zh'
  }
}

function tr(key, lang = getCurrentLang()) {
  return translations[lang]?.[key] ?? translations.zh[key] ?? ''
}

const defaultState = () => ({
  labId: '',
  lab: {
    name: '',
    nameCn: '',
    openingDate: '',
    address: '',
    phone: ''
  },
  availableStaff: [], // staff list fetched from API: [{ uid, name }]
  hosts: [],
  guests: [],

  timeline: [],
  projects: [],
  prizes: [],
  budget: [],
  leads: [],
  reception: [],
  vips: [],
  raffleHosts: [],
  staff: { chiefLead: '', host: '' },
  posters: [],
  videos: [],
  banners: [],
  socialPosts: [],
  checklist: Array(15).fill(false),
  checklistOwners: Array(15).fill(''),
  checklistItems: null,
  promoProjects: [],
  ageGroups: [],
  ageStructure: {
    age36: { count: 12, percent: 14 },
    age714: { count: 65, percent: 76 },
    age15: { count: 10, percent: 10 }
  },
  social: { instagram: '', facebook: '', youtube: '', xiaohongshu: '' },
  goals: { camp: 30, vexElementary: tr('defaultTeamCount'), vexMiddle: tr('defaultTeamCount'), other: '' },
  discounts: { type: tr('defaultDiscountType'), amount: '20% OFF', valid: tr('defaultDiscountValid') }
})

export const useLabStore = defineStore('lab', {
  state: defaultState,

  getters: {
    daysLeft(state) {
      const openingDate = new Date(state.lab.openingDate)
      const today = new Date()
      const diff = Math.ceil((openingDate - today) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 0
    },
    guestCount(state) {
      return state.guests.length
    },
    checklistProgress(state) {
      const checked = state.checklist.filter(Boolean).length
      return Math.round((checked / state.checklist.length) * 100)
    },
    totalBudgetAmount(state) {
      return state.budget.reduce((sum, b) => sum + (b.amount || 0), 0)
    },
    totalStudents(state) {
      const s = state.ageStructure
      return (s.age36?.count || 0) + (s.age714?.count || 0) + (s.age15?.count || 0)
    }
  },

  actions: {
    loadData() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.$patch(parsed)
        } catch (e) {
          console.error('Failed to load data:', e)
        }
      }
    },

    saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
    },

    loadPreset() {
      // Preserve lab info (from API) and labId — only apply non-lab preset fields
      const { lab: _lab, ...rest } = getLasVegasData()
      this.$patch({ ...rest })
      this.saveData()
    },

    exportData() {
      this.saveData()
      const dataStr = JSON.stringify(this.$state, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lab-opening-${this.lab.name || 'assistant'}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    },

    loadFromJSON(jsonData) {
      this.$patch(jsonData)
      this.saveData()
    },

    // ---- Hosts ----
    addHost(host) { this.hosts.push(host); this.saveData() },
    updateHost(index, host) { this.hosts[index] = host; this.saveData() },
    deleteHost(index) { this.hosts.splice(index, 1); this.saveData() },

    // ---- Guests ----
    addGuest(guest) { this.guests.push(guest); this.saveData() },
    updateGuest(index, guest) { this.guests[index] = guest; this.saveData() },
    deleteGuest(index) { this.guests.splice(index, 1); this.saveData() },

    // ---- Timeline ----
    addTimeline(item) {
      this.timeline.push(item)
      this.timeline.sort((a, b) => a.time.localeCompare(b.time))
      this.saveData()
    },
    updateTimeline(index, item) {
      this.timeline[index] = item
      this.timeline.sort((a, b) => a.time.localeCompare(b.time))
      this.saveData()
    },
    deleteTimeline(index) { this.timeline.splice(index, 1); this.saveData() },

    // ---- Projects ----
    addProject(project) { this.projects.push(project); this.saveData() },
    updateProject(index, project) { this.projects[index] = project; this.saveData() },
    deleteProject(index) { this.projects.splice(index, 1); this.saveData() },

    // ---- Prizes ----
    addPrize(prize) { this.prizes.push(prize); this.saveData() },
    updatePrize(index, prize) { this.prizes[index] = prize; this.saveData() },
    deletePrize(index) { this.prizes.splice(index, 1); this.saveData() },

    // ---- Budget ----
    addBudget(item) { this.budget.push(item); this.saveData() },
    updateBudget(index, item) { this.budget[index] = { ...this.budget[index], ...item }; this.saveData() },
    deleteBudget(index) { this.budget.splice(index, 1); this.saveData() },
    updateBudgetSpent(index, spent) { this.budget[index].spent = parseFloat(spent) || 0; this.saveData() },
    updateBudgetNote(index, note) { this.budget[index].note = note; this.saveData() },

    // ---- Leads ----
    addLead(lead) { this.leads.push(lead); this.saveData() },
    updateLead(index, lead) { this.leads[index] = lead; this.saveData() },
    deleteLead(index) { this.leads.splice(index, 1); this.saveData() },

    // ---- Reception ----
    addReception(r) { this.reception.push(r); this.saveData() },
    updateReception(index, r) { this.reception[index] = r; this.saveData() },
    deleteReception(index) { this.reception.splice(index, 1); this.saveData() },

    // ---- VIPs ----
    addVIP(vip) { this.vips.push(vip); this.saveData() },
    updateVIP(index, vip) { this.vips[index] = vip; this.saveData() },
    deleteVIP(index) { this.vips.splice(index, 1); this.saveData() },

    // ---- Raffle Hosts ----
    addRaffleHost(r) { this.raffleHosts.push(r); this.saveData() },
    updateRaffleHost(index, r) { this.raffleHosts[index] = r; this.saveData() },
    deleteRaffleHost(index) { this.raffleHosts.splice(index, 1); this.saveData() },

    // ---- Materials ----
    addPoster(p) { this.posters.push(p); this.saveData() },
    updatePoster(index, p) { this.posters[index] = p; this.saveData() },
    deletePoster(index) { this.posters.splice(index, 1); this.saveData() },

    addVideo(v) { this.videos.push(v); this.saveData() },
    updateVideo(index, v) { this.videos[index] = v; this.saveData() },
    deleteVideo(index) { this.videos.splice(index, 1); this.saveData() },

    addBanner(b) { this.banners.push(b); this.saveData() },
    updateBanner(index, b) { this.banners[index] = b; this.saveData() },
    deleteBanner(index) { this.banners.splice(index, 1); this.saveData() },

    // ---- Social Posts ----
    addSocialPost(post) { this.socialPosts.push(post); this.saveData() },
    updateSocialPost(index, post) { this.socialPosts[index] = post; this.saveData() },
    deleteSocialPost(index) { this.socialPosts.splice(index, 1); this.saveData() },

    // ---- Checklist ----
    toggleChecklist(index) {
      this.checklist[index] = !this.checklist[index]
      this.saveData()
    },
    updateChecklistOwner(index, owner) {
      this.checklistOwners[index] = owner
      this.saveData()
    },
    updateChecklistItem(index, text) {
      if (!this.checklistItems) {
        const lang = localStorage.getItem('magikidLabLang') || 'zh'
        const defaults = translations[lang]?.checklistItems || DEFAULT_CHECKLIST_ITEMS
        this.checklistItems = [...defaults]
      }
      this.checklistItems[index] = text
      this.saveData()
    },

    // ---- Inline field saves ----
    saveLab(lab) { this.lab = { ...this.lab, ...lab }; this.saveData() },
    saveSocial(social) { this.social = { ...this.social, ...social }; this.saveData() },
    saveGoals(goals) { this.goals = { ...this.goals, ...goals }; this.saveData() },
    saveStaff(staff) { this.staff = { ...this.staff, ...staff }; this.saveData() },
    saveDiscounts(discounts) { this.discounts = { ...this.discounts, ...discounts }; this.saveData() },
    savePromoProjects(list) { this.promoProjects = list; this.saveData() },
    saveAgeStructure(s) { this.ageStructure = { ...this.ageStructure, ...s }; this.saveData() },

    // Re-translate untouched default values when the UI language changes.
    migrateLanguageDefaults(newLang) {
      const otherLang = newLang === 'zh' ? 'en' : 'zh'
      const isUntouched = (value, key) => value === tr(key, otherLang) || value === tr(key, newLang)
      let changed = false
      if (isUntouched(this.goals.vexElementary, 'defaultTeamCount')) {
        this.goals.vexElementary = tr('defaultTeamCount', newLang); changed = true
      }
      if (isUntouched(this.goals.vexMiddle, 'defaultTeamCount')) {
        this.goals.vexMiddle = tr('defaultTeamCount', newLang); changed = true
      }
      if (isUntouched(this.discounts.type, 'defaultDiscountType')) {
        this.discounts.type = tr('defaultDiscountType', newLang); changed = true
      }
      if (isUntouched(this.discounts.valid, 'defaultDiscountValid')) {
        this.discounts.valid = tr('defaultDiscountValid', newLang); changed = true
      }
      if (changed) this.saveData()
    },

    // ---- Lab API init ----
    async initFromLabAPI(labId, { force = false } = {}) {
      // If we already have saved data for this same labId, just load it and skip the API call
      if (!force) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed.labId === labId) {
              this.$patch(parsed)
              console.log('[lab-api] restored saved data for labId:', labId)
              return
            }
          } catch (e) {
            // ignore parse errors, fall through to API fetch
          }
        }
      }

      try {
        const res = await axios.post('https://api.magikidlab.com/lab-opening-assistant/get-lab-info', { labid: labId })
        const data = res.data?.result ?? res.data
        console.log('[lab-api] raw:', res.data, '→ using:', data)
        // Reset everything to empty first
        this.$patch(defaultState())
        // Store the labId so we can detect it on next refresh
        this.labId = labId
        // Then pre-fill lab info from API
        this.lab = {
          name: data.labName || '',
          nameCn: data.labNameCn || '',
          openingDate: '',
          address: data.address || '',
          phone: data.tel || ''
        }
        this.availableStaff = Array.isArray(data.staff) ? data.staff : []
        this.saveData()
      } catch (e) {
        console.error('Failed to fetch lab info:', e)
      }
    },

    resetToEmpty() {
      this.$patch(defaultState())
      localStorage.removeItem(STORAGE_KEY)
    },
  }
})

export const DEFAULT_CHECKLIST_ITEMS = [
  '确认场地布置',
  '邀请嘉宾名单确认',
  '活动流程彩排',
  '设备调试（机器人、展示项目）',
  '餐饮预订确认',
  '物料印刷完成',
  '奖品准备',
  '社交媒体预告发布',
  '人员分工确认',
  '应急预案准备',
  '网站设计完成',
  '课程发布',
  '夏令营发布 & 完赛队召集发布',
  '微信群建立',
  '线上宣讲会预热',
]
