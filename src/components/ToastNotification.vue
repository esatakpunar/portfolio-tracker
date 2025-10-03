<template>
  <Transition name="toast" appear>
    <div 
      v-if="visible" 
      :class="['toast', `toast--${type}`]"
      @click="$emit('close')"
    >
      <div class="toast-icon">
        <span class="material-symbols-outlined">{{ icon }}</span>
      </div>
      <div class="toast-content">
        <p class="toast-message">{{ message }}</p>
      </div>
      <button class="toast-close" @click.stop="$emit('close')">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    }
  },
  computed: {
    icon() {
      const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
      }
      return icons[this.type]
    }
  },
  mounted() {
    if (this.visible) {
      setTimeout(() => {
        this.$emit('close')
      }, 4000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.toast {
  position: fixed;
  top: $space-6;
  right: $space-6;
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  box-shadow: $shadow-xl;
  max-width: 400px;
  z-index: $z-tooltip;
  cursor: pointer;
  transition: $transition-normal;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-2xl;
  }
  
  &--success {
    border-left: 4px solid $color-success;
    
    .toast-icon {
      background: linear-gradient(135deg, $color-success 0%, #16a34a 100%);
    }
  }
  
  &--error {
    border-left: 4px solid $color-danger;
    
    .toast-icon {
      background: linear-gradient(135deg, $color-danger 0%, #dc2626 100%);
    }
  }
  
  &--warning {
    border-left: 4px solid $color-warning;
    
    .toast-icon {
      background: linear-gradient(135deg, $color-warning 0%, #ea580c 100%);
    }
  }
  
  &--info {
    border-left: 4px solid $color-primary;
    
    .toast-icon {
      background: $gradient-primary;
    }
  }
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .material-symbols-outlined {
    font-size: 18px;
    color: $color-text-primary;
  }
}

.toast-content {
  flex: 1;
}

.toast-message {
  color: $color-text-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  line-height: 1.4;
  margin: 0;
}

.toast-close {
  background: none;
  border: none;
  color: $color-text-muted;
  cursor: pointer;
  padding: $space-1;
  border-radius: $radius-sm;
  transition: $transition-fast;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: $color-text-primary;
  }
  
  .material-symbols-outlined {
    font-size: 16px;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
</style>