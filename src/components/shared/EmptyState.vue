<template>
  <div class="empty-state">
    <i :class="icon"></i>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'fas fa-inbox' },
  message: { type: String, default: '暂无数据' }
})
</script>
