<template>
  <div class="modal-overlay" :class="{ active: modelValue }" @click.self="$emit('update:modelValue', false)">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="$emit('update:modelValue', false)">&times;</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn btn-secondary" @click="$emit('update:modelValue', false)">{{ cancelText }}</button>
          <button class="btn btn-primary" @click="$emit('confirm')">{{ confirmText }}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  confirmText: { type: String, default: '添加' },
  cancelText: { type: String, default: '取消' }
})
defineEmits(['update:modelValue', 'confirm'])
</script>
