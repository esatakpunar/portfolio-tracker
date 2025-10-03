import { reactive } from 'vue'

const toastState = reactive({
  toasts: []
})

let toastId = 0

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      visible: true
    }
    
    toastState.toasts.push(toast)
    
    setTimeout(() => {
      const index = toastState.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        toastState.toasts.splice(index, 1)
      }
    }, duration)
  }
  
  const removeToast = (id) => {
    const index = toastState.toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toastState.toasts.splice(index, 1)
    }
  }
  
  return {
    toasts: toastState.toasts,
    showToast,
    removeToast
  }
}