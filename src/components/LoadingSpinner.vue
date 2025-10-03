<template>
  <div class="loading-container">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-8;
}

.loading-spinner {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: $space-4;
}

.spinner-ring {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  
  &:nth-child(1) {
    border-top-color: $color-primary;
    animation-delay: -0.45s;
  }
  
  &:nth-child(2) {
    border-top-color: $color-primary-light;
    animation-delay: -0.3s;
  }
  
  &:nth-child(3) {
    border-top-color: $color-secondary;
    animation-delay: -0.15s;
  }
}

.loading-message {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-align: center;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>