<template>
  <div class="settings-content">
    <div class="section-header">
      <div class="section-icon-wrapper">
        <span class="section-icon">💰</span>
      </div>
      <div class="section-header-content">
        <h3 class="section-title">{{ $t('refreshPrices') }}</h3>
        <p class="section-subtitle">{{ $t('currentMarketPrices') }}</p>
      </div>
    </div>
    
    <button 
      type="button" 
      class="refresh-button"
      :class="{ 'loading': isRefreshing }"
      @click="refreshPrices"
      :disabled="isRefreshing"
    >
      <div class="refresh-button-content">
        <span class="refresh-button-icon">{{ isRefreshing ? '⏳' : '🔄' }}</span>
        <span class="refresh-button-text">{{ $t('refresh') }}</span>
      </div>
    </button>
    
    <div class="prices-container">
      <div 
        v-for="(val, key) in filteredPrices" 
        :key="key" 
        class="price-item"
      >
        <div class="price-item-left">
          <div 
            class="price-icon-container"
            :style="{ 
              backgroundColor: getPriceColor(key) + '20',
              borderColor: getPriceColor(key) + '40'
            }"
          >
            <span 
              class="price-icon"
              :style="{ color: getPriceColor(key) }"
            >
              {{ getPriceIcon(key) }}
            </span>
          </div>
          <span class="price-label">{{ priceLabel(key) }}</span>
        </div>
        
        <div class="price-value-container">
          <span class="price-value">
            {{ val.toLocaleString('tr-TR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) }}
          </span>
          <span class="price-currency">₺</span>
        </div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-icon-wrapper danger-icon">
        <span class="section-icon">⚠️</span>
      </div>
      <div class="section-header-content">
        <h3 class="section-title">{{ $t('dangerZone') }}</h3>
        <p class="section-subtitle">{{ $t('resetAllDataSubtitle') }}</p>
      </div>
    </div>
    
    <button class="danger-button" @click="$emit('reset-all')">
      <div class="danger-button-content">
        <span class="danger-button-icon">🗑️</span>
        <span class="danger-button-text">{{ $t('resetAllData') }}</span>
      </div>
    </button>
  </div>
</template>
<script>
import { priceLabel } from '../store/index.js'
export default {
  props: {
    prices: Object
  },
  data() {
    return {
      isRefreshing: false
    }
  },
  computed: {
    filteredPrices() {
      const filtered = { ...this.prices }
      delete filtered.tl // Remove TL as it's the base currency
      return filtered
    }
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    getPriceIcon(key) {
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
      return iconMap[key] || '₲'
    },
    getPriceColor(key) {
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
      return colorMap[key] || '#6366f1'
    },
    async refreshPrices() {
      this.isRefreshing = true
      try {
        await this.$store.dispatch('fetchPrices')
      } catch (error) {
        // Error handling
      } finally {
        this.isRefreshing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.settings-content {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  margin-top: $space-6;
}

.section-header {
  display: flex;
  align-items: center;
}

.section-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: $radius-lg;
  background: rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-4;
  
  &.danger-icon {
    background: rgba(239, 68, 68, 0.2);
  }
}

.section-icon {
  font-size: 24px;
}

.section-header-content {
  flex: 1;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: 2px;
  line-height: 1.2;
}

.section-subtitle {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.3;
  margin-bottom: 0;
}

.refresh-button {
  background: $color-glass;
  border: 2px solid $color-primary;
  border-radius: $radius-xl;
  padding: $space-3 $space-4;
  cursor: pointer;
  transition: $transition-normal;
  backdrop-filter: blur($blur-sm);
  width: 100%;
  
  &.loading {
    border-color: $color-text-muted;
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(.loading) {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
    box-shadow: $shadow-lg;
  }
}

.refresh-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
}

.refresh-button-icon {
  font-size: 20px;
}

.refresh-button-text {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.prices-container {
  background: $color-glass;
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  overflow: hidden;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 $space-4;
  border-bottom: 1px solid $color-border;
  
  &:last-child {
    border-bottom: none;
  }
}

.price-item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.price-icon-container {
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-4;
  border: 2px solid;
}

.price-icon {
  font-size: 18px;
  font-weight: $font-weight-bold;
}

.price-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.price-value-container {
  display: flex;
  align-items: baseline;
  gap: $space-1;
}

.price-value {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.price-currency {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
}

.danger-button {
  background: $color-glass;
  border: 2px solid $color-danger;
  border-radius: $radius-xl;
  padding: $space-3 $space-4;
  cursor: pointer;
  transition: $transition-normal;
  backdrop-filter: blur($blur-sm);
  width: 100%;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
    box-shadow: $shadow-lg, 0 0 20px rgba(239, 68, 68, 0.3);
  }
}

.danger-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
}

.danger-button-icon {
  font-size: 20px;
}

.danger-button-text {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $color-danger;
}
</style>