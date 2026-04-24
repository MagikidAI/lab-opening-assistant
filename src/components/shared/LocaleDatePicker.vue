<template>
  <div class="date-picker" ref="rootRef">
    <div class="date-picker-input form-input" :class="{ 'is-empty': !modelValue }" @click="toggleOpen" tabindex="0" @keydown.enter.prevent="toggleOpen" @keydown.space.prevent="toggleOpen">
      <span v-if="modelValue">{{ displayValue }}</span>
      <span v-else class="date-picker-placeholder">{{ placeholder || t('datePlaceholder') }}</span>
      <i class="fas fa-calendar-alt date-picker-icon"></i>
    </div>
    <Teleport to="body">
      <div v-if="open" class="date-picker-popover" :style="popoverStyle" ref="popoverRef" @click.stop @mousedown.stop>
        <div class="date-picker-header">
          <button type="button" class="date-picker-nav" @click="shiftMonth(-1)" :title="t('prevMonth')"><i class="fas fa-chevron-left"></i></button>
          <div class="date-picker-title">{{ monthLabel }}</div>
          <button type="button" class="date-picker-nav" @click="shiftMonth(1)" :title="t('nextMonth')"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="date-picker-weekdays">
          <span v-for="(w, i) in weekdayLabels" :key="i">{{ w }}</span>
        </div>
        <div class="date-picker-grid">
          <button
            type="button"
            v-for="(cell, i) in cells"
            :key="i"
            class="date-picker-cell"
            :class="{ 'is-outside': !cell.inMonth, 'is-selected': cell.selected, 'is-today': cell.today }"
            @click="select(cell.date)"
          >{{ cell.day }}</button>
        </div>
        <div class="date-picker-footer">
          <button type="button" class="date-picker-action" @click="clear">{{ t('clear') }}</button>
          <button type="button" class="date-picker-action" @click="selectToday">{{ t('today') }}</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

const props = defineProps({
  modelValue: { type: String, default: '' }, // ISO yyyy-mm-dd
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'change'])

const { t, currentLang } = useI18n()
const open = ref(false)
const rootRef = ref(null)
const popoverRef = ref(null)
const popoverStyle = ref({})

const locale = computed(() => t('localeCode') || (currentLang.value === 'zh' ? 'zh-CN' : 'en-US'))

function parseISO(s) {
  if (!s) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}

function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const viewDate = ref(parseISO(props.modelValue) || new Date())

watch(() => props.modelValue, (val) => {
  const d = parseISO(val)
  if (d) viewDate.value = d
})

const displayValue = computed(() => {
  const d = parseISO(props.modelValue)
  if (!d) return ''
  return d.toLocaleDateString(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit' })
})

const monthLabel = computed(() => {
  return viewDate.value.toLocaleDateString(locale.value, { year: 'numeric', month: 'long' })
})

const weekdayLabels = computed(() => {
  const base = new Date(2024, 0, 7) // Sunday
  const fmt = new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    return fmt.format(d)
  })
})

const cells = computed(() => {
  const y = viewDate.value.getFullYear()
  const m = viewDate.value.getMonth()
  const first = new Date(y, m, 1)
  const startOffset = first.getDay()
  const gridStart = new Date(y, m, 1 - startOffset)
  const selected = parseISO(props.modelValue)
  const todayISO = toISO(new Date())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    const iso = toISO(d)
    return {
      date: d,
      day: d.getDate(),
      inMonth: d.getMonth() === m,
      selected: selected && iso === toISO(selected),
      today: iso === todayISO
    }
  })
})

function updatePosition() {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const width = 280
  const margin = 8
  let left = rect.left
  if (left + width + margin > window.innerWidth) {
    left = Math.max(margin, window.innerWidth - width - margin)
  }
  let top = rect.bottom + 6
  // If not enough space below, flip above
  const estHeight = 320
  if (top + estHeight > window.innerHeight && rect.top - estHeight - 6 > 0) {
    top = rect.top - estHeight - 6
  }
  popoverStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`
  }
}

function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    const d = parseISO(props.modelValue)
    if (d) viewDate.value = d
    nextTick(updatePosition)
  }
}

function shiftMonth(delta) {
  const d = new Date(viewDate.value)
  d.setDate(1)
  d.setMonth(d.getMonth() + delta)
  viewDate.value = d
}

function select(d) {
  const iso = toISO(d)
  emit('update:modelValue', iso)
  emit('change', iso)
  open.value = false
}

function selectToday() {
  select(new Date())
}

function clear() {
  emit('update:modelValue', '')
  emit('change', '')
  open.value = false
}

function handleDocClick(e) {
  if (!open.value) return
  const inRoot = rootRef.value && rootRef.value.contains(e.target)
  const inPopover = popoverRef.value && popoverRef.value.contains(e.target)
  if (!inRoot && !inPopover) open.value = false
}

function handleReposition() {
  if (open.value) updatePosition()
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocClick)
  window.addEventListener('scroll', handleReposition, true)
  window.addEventListener('resize', handleReposition)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocClick)
  window.removeEventListener('scroll', handleReposition, true)
  window.removeEventListener('resize', handleReposition)
})
</script>

<style scoped>
.date-picker { position: relative; width: 100%; }
.date-picker-input {
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; user-select: none;
}
.date-picker-input.is-empty { color: var(--text-secondary); }
.date-picker-placeholder { color: var(--text-secondary); opacity: 0.7; }
.date-picker-icon { color: var(--accent-cyan); margin-left: 0.5rem; }
</style>

<style>
/* Global (non-scoped) so teleported popover is styled correctly */
.date-picker-popover {
  z-index: 9999;
  padding: 0.75rem;
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
  font-family: inherit;
}
.date-picker-popover .date-picker-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.5rem;
}
.date-picker-popover .date-picker-title {
  font-weight: 600; color: var(--text-primary); text-transform: capitalize;
}
.date-picker-popover .date-picker-nav {
  background: transparent; border: 1px solid var(--border-color);
  color: var(--accent-cyan); width: 28px; height: 28px; border-radius: 6px;
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
}
.date-picker-popover .date-picker-nav:hover { background: rgba(0, 212, 255, 0.1); }
.date-picker-popover .date-picker-weekdays,
.date-picker-popover .date-picker-grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;
}
.date-picker-popover .date-picker-weekdays { margin-bottom: 4px; }
.date-picker-popover .date-picker-weekdays span {
  text-align: center; font-size: 0.7rem; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 4px 0;
}
.date-picker-popover .date-picker-cell {
  background: transparent; border: none; color: var(--text-primary);
  height: 32px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;
}
.date-picker-popover .date-picker-cell:hover { background: rgba(0, 212, 255, 0.15); }
.date-picker-popover .date-picker-cell.is-outside { color: var(--text-secondary); opacity: 0.4; }
.date-picker-popover .date-picker-cell.is-today { border: 1px solid var(--accent-cyan); }
.date-picker-popover .date-picker-cell.is-selected {
  background: var(--accent-cyan); color: var(--bg-primary); font-weight: 600;
}
.date-picker-popover .date-picker-footer {
  display: flex; justify-content: space-between; margin-top: 0.5rem;
  padding-top: 0.5rem; border-top: 1px solid var(--border-color);
}
.date-picker-popover .date-picker-action {
  background: transparent; border: none; color: var(--accent-cyan);
  cursor: pointer; font-size: 0.8rem; padding: 4px 8px;
}
.date-picker-popover .date-picker-action:hover { text-decoration: underline; }
</style>
