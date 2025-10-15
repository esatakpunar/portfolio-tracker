<template>
  <div class="swipeable-asset-card" ref="cardRef">
    <!-- Swipe Actions (Delete Button) -->
    <div class="swipe-actions" :class="{ 'visible': isSwiped }">
      <button 
        class="delete-action"
        @click.stop="handleDelete"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
    
    <!-- Main Card Content -->
    <div 
      class="asset-card-content"
      :class="{ 'swiped': isSwiped }"
      :style="{ transform: `translateX(${translateX}px)` }"
      @click.stop="handleCardClick"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div 
        class="asset-icon"
        :style="{ 
          backgroundColor: getAssetColor(item.type) + '20',
          borderColor: getAssetColor(item.type) + '40'
        }"
      >
        <span 
          class="asset-icon-text"
          :style="{ color: getAssetColor(item.type) }"
        >
          {{ getAssetIcon(item.type) }}
        </span>
      </div>
      <div class="asset-content">
        <div class="asset-name">{{ priceLabel(item.type) }}</div>
        <div class="asset-amount">{{ formatAmount(item.amount) }} {{ item.unit || getDefaultUnit(item.type) }}</div>
      </div>
      <div class="asset-value">
        <div class="value-amount">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { priceLabel } from '../store/index.js'

export default {
  name: 'SwipeableAssetCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    onEdit: {
      type: Function,
      default: () => {}
    },
    onDelete: {
      type: Function,
      default: () => {}
    },
    onSwipeableWillOpen: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      translateX: 0,
      isSwiped: false,
      touchStartX: 0,
      touchStartY: 0,
      isSwiping: false,
      startTranslateX: 0,
      swipeThreshold: 80, // Minimum swipe distance to trigger action
      maxSwipeDistance: 80 // Maximum swipe distance
    }
  },
  mounted() {
    // Add click outside listener when component is mounted
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    // Remove click outside listener when component is unmounted
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    getAssetIcon(type) {
      const iconMap = {
        'tl': '₺',
        'usd': '$',
        'eur': '€',
        'gumus': '₲',
        'tam': '₲',
        'ceyrek': '₲',
        '22_ayar': '₲',
        '24_ayar': '₲',
      }
      return iconMap[type] || '₲'
    },
    getAssetColor(type) {
      const colorMap = {
        'tl': '#dc2626',
        'usd': '#10b981',
        'eur': '#3b82f6',
        'gumus': '#6b7280',
        'tam': '#f59e0b',
        'ceyrek': '#f59e0b',
        '22_ayar': '#f59e0b',
        '24_ayar': '#f59e0b',
      }
      return colorMap[type] || '#6366f1'
    },
    getDefaultUnit(type) {
      if (type === 'usd' || type === 'eur' || type === 'tl' || type === 'ceyrek' || type === 'tam') {
        return this.$t('units.piece')
      }
      return this.$t('units.gram')
    },
    formatAmount(amount) {
      const locale = this.$store.state.currentLanguage === 'tr' ? 'tr-TR' : 
                     this.$store.state.currentLanguage === 'de' ? 'de-DE' : 'en-US'
      return amount.toLocaleString(locale, { maximumFractionDigits: 4 })
    },
    handleCardClick() {
      if (this.isSwiped) {
        // If swipe is open, close it
        this.closeSwipe()
      } else {
        // If swipe is closed, emit card click event
        this.$emit('card-click', this.item)
      }
    },
    handleClickOutside(event) {
      // Only close if swipe is open and click is outside the card
      if (this.isSwiped && this.$refs.cardRef && !this.$refs.cardRef.contains(event.target)) {
        this.closeSwipe()
      }
    },
    handleDelete() {
      this.closeSwipe()
      this.onDelete(this.item)
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX
      this.touchStartY = event.touches[0].clientY
      this.startTranslateX = this.translateX
      this.isSwiping = false
    },
    handleTouchMove(event) {
      if (!this.touchStartX) return
      
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const deltaX = this.touchStartX - touchX
      const deltaY = this.touchStartY - touchY
      
      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isSwiping = true
        event.preventDefault()
        
        // Only allow left swipe (negative deltaX)
        if (deltaX > 0) {
          const newTranslateX = Math.max(-this.maxSwipeDistance, this.startTranslateX - deltaX)
          this.translateX = newTranslateX
          this.isSwiped = newTranslateX < -this.swipeThreshold
        }
      }
    },
    handleTouchEnd(event) {
      if (!this.touchStartX || !this.isSwiping) return
      
      const touchEndX = event.changedTouches[0].clientX
      const deltaX = this.touchStartX - touchEndX
      
      if (deltaX > this.swipeThreshold) {
        // Snap to open position
        this.translateX = -this.maxSwipeDistance
        this.isSwiped = true
        this.onSwipeableWillOpen(this.item.type)
      } else {
        // Snap back to closed position
        this.closeSwipe()
      }
      
      this.touchStartX = 0
      this.touchStartY = 0
      this.isSwiping = false
    },
    closeSwipe() {
      this.translateX = 0
      this.isSwiped = false
    },
    // Method to close swipe from parent component
    close() {
      this.closeSwipe()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.swipeable-asset-card {
  position: relative;
  border-radius: $radius-xl;
  background: transparent;
  transition: $transition-normal;
  overflow: hidden;
  
  &:hover .asset-card-content {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px) translateY(-1px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: $shadow-lg;
  }
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: $space-4;
  z-index: 1;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.2s ease-out;
  
  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
}

.delete-action {
  background: $color-danger;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3;
  border-radius: $radius-lg;
  transition: $transition-normal;
  box-shadow: $shadow-md;
  
  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.asset-card-content {
  display: flex;
  align-items: center;
  padding: $space-4;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  transition: transform 0.2s ease-out;
  position: relative;
  overflow: hidden;
  min-height: 60px;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    z-index: 3;
  }
  
  &.swiped {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.asset-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  margin-right: $space-4;
  border: 2px solid;
  flex-shrink: 0;
}

.asset-icon-text {
  font-size: 22px;
  font-weight: $font-weight-bold;
}

.asset-content {
  flex: 1;
}

.asset-name {
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  font-size: $font-size-base;
  margin-bottom: 2px;
  line-height: 1.2;
}

.asset-amount {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  line-height: 1.3;
}

.asset-value {
  text-align: right;
  margin-right: $space-3;
}

.value-amount {
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  font-size: $font-size-base;
  line-height: 1.2;
}
</style>
