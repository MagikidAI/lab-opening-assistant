<template>
  <div class="section-card">
    <div class="section-header" @click="toggle">
      <h2>
        <i :class="icon"></i>
        <span>{{ title }}</span>
      </h2>
      <i class="fas fa-chevron-down section-toggle transition-transform duration-300" :class="{ 'rotate-[-90deg]': collapsed }"></i>
    </div>
    <div v-show="!collapsed" class="section-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true }
})

const collapsed = ref(false)
function toggle() { collapsed.value = !collapsed.value }
</script>
