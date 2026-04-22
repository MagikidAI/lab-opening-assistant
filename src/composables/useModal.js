import { ref } from 'vue'

const activeModal = ref(null)

export function useModal() {
  function openModal(id) {
    activeModal.value = id
  }

  function closeModal(id) {
    if (activeModal.value === id) {
      activeModal.value = null
    }
  }

  function isModalOpen(id) {
    return activeModal.value === id
  }

  return { openModal, closeModal, isModalOpen }
}
