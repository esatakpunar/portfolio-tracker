<template>
  <div v-if="history.length === 0" class="empty-state">
    <div class="empty-icon-container">
      <span class="empty-icon">📋</span>
    </div>
    <h3 class="empty-state-title">{{ $t('noHistory') }}</h3>
    <p class="empty-state-subtitle">{{ $t('noHistorySubtitle') }}</p>
  </div>
  
  <div v-else class="history-list">
    <div 
      v-for="(h, i) in history.slice(0, 10)" 
      :key="i" 
      class="history-item"
    >
      <div class="history-left">
        <div 
          class="asset-icon-container"
          :style="{ 
            backgroundColor: getAssetColor(h.item.type) + '20',
            borderColor: getAssetColor(h.item.type) + '40'
          }"
        >
          <span 
            class="asset-icon"
            :style="{ color: getAssetColor(h.item.type) }"
          >
            {{ getAssetIcon(h.item.type) }}
          </span>
        </div>
        
        <div class="history-info">
          <div class="asset-type">{{ priceLabel(h.item.type) }}</div>
          <div v-if="h.description" class="history-description">
            {{ h.description }}
          </div>
        </div>
      </div>
      
      <div class="history-right">
        <div class="amount-container">
          <div 
            class="action-badge"
            :style="{ 
              backgroundColor: h.type === 'add' ? '#10b981' + '20' : '#ef4444' + '20' 
            }"
          >
            <span 
              class="action-icon"
              :style="{ 
                color: h.type === 'add' ? '#10b981' : '#ef4444' 
              }"
            >
              {{ h.type === 'add' ? '↑' : '↓' }}
            </span>
          </div>
          <span 
            class="history-amount"
            :style="{ 
              color: h.type === 'add' ? '#10b981' : '#ef4444' 
            }"
          >
            {{ h.type === 'add' ? '+' : '−' }}{{ formatAmount(h.item.amount) }}
          </span>
        </div>
        <div class="history-date">{{ formatDate(h.date) }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { priceLabel } from '../store/index.js'
export default {
  props: {
    history: Array
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return date.toLocaleString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (days === 1) {
        return this.$t('yesterday')
      } else if (days < 7) {
        return `${days} ${this.$t('daysAgo')}`
      } else {
        return date.toLocaleString('tr-TR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      }
    },
    formatAmount(amount) {
      return amount.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12 $space-6;
  text-align: center;
  margin-top: $space-6;
}

.empty-icon-container {
  width: 80px;
  height: 80px;
  border-radius: $radius-full;
  background: $color-glass;
  border: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $space-6;
  backdrop-filter: blur($blur-sm);
}

.empty-icon {
  font-size: 40px;
}

.empty-state-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $space-3;
}

.empty-state-subtitle {
  font-size: $font-size-base;
  color: $color-text-secondary;
  line-height: 1.6;
  max-width: 300px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: $space-6;
}

.history-item {
  display: flex;
  align-items: center;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  padding: $space-4;
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px) translateY(-1px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: $shadow-lg;
  }
}

.history-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.asset-icon-container {
  width: 48px;
  height: 48px;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-4;
  border: 2px solid;
}

.asset-icon {
  font-size: 22px;
  font-weight: $font-weight-bold;
}

.history-info {
  flex: 1;
}

.asset-type {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: 2px;
  line-height: 1.2;
}

.history-description {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  line-height: 1.3;
}

.history-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.amount-container {
  display: flex;
  align-items: center;
  margin-bottom: $space-2;
}

.action-badge {
  width: 24px;
  height: 24px;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-1;
}

.action-icon {
  font-size: 14px;
  font-weight: $font-weight-bold;
}

.history-amount {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  line-height: 1.2;
}

.history-date {
  font-size: $font-size-xs;
  color: $color-text-muted;
  font-weight: $font-weight-medium;
}
</style>
