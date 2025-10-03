<template>
  <div class="portfolio-container">
    <!-- Modern Asset List -->
    <div v-if="itemsWithValue.length > 0" class="asset-list animate-fade-in">
      <div
        v-for="(it, i) in itemsWithValue"
        :key="`${it.type}-${it.unit || 'default'}`"
        class="asset-card"
      >
        <div class="asset-card-content">
          <div :class="['asset-icon', iconBgClass(it.type)]">
            <span class="material-symbols-outlined">{{ iconClass(it.type) }}</span>
          </div>
          <div class="asset-content">
            <div class="asset-name">{{ priceLabel(it.type) }}</div>
            <div class="asset-amount">{{ formatAmount(it.amount) }} {{ it.unit || getDefaultUnit(it.type) }}</div>
          </div>
          <div class="asset-value">
            <div class="value-amount">{{ it.value }}</div>
          </div>
          <button class="delete-icon-btn" @click="openDeleteModal(it, i)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state animate-fade-in">
      <div class="empty-icon">
        <span class="material-symbols-outlined">account_balance_wallet</span>
      </div>
      <h3 class="empty-title">{{ $t('noAssets') }}</h3>
      <p class="empty-description">{{ $t('addFirstAsset') }}</p>
    </div>
    
    <!-- Modern Delete Modal -->
    <DeleteItemModal
      :visible="showDeleteModal"
      :item="deleteTarget"
      :max-amount="deleteTarget.amount"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import DeleteItemModal from './DeleteItemModal.vue'
import { priceLabel } from '../store/index.js'
export default {
  components: { DeleteItemModal },
  props: {
    selected: String,
    tabs: Array,
    itemsWithValue: Array,
    totalFormatted: String
  },
  data() {
    return {
      showDeleteModal: false,
      deleteTarget: {},
      deleteIndex: null
    }
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    iconClass(type) {
      const map = {
        '24_ayar': 'paid', // gold
        '22_ayar': 'paid', // gold
        'ceyrek': 'paid', // gold
        'tam': 'paid', // gold
        'usd': 'attach_money',
        'eur': 'euro',
        'gumus': 'circle'
      }
      return map[type] || 'help'
    },
    mdiClass(type) {
      const map = {
        '24_ayar': 'mdi-gold',
        '22_ayar': 'mdi-gold',
        'ceyrek': 'mdi-gold',
        'tam': 'mdi-gold',
        'usd': 'mdi-currency-usd',
        'eur': 'mdi-currency-eur',
        'gumus': 'mdi-silver'
      }
      return map[type] || 'mdi-help'
    },
    iconBgClass(type) {
      const map = {
        '24_ayar': 'icon-gold',
        '22_ayar': 'icon-gold',
        'ceyrek': 'icon-gold',
        'tam': 'icon-gold',
        'usd': 'icon-usd',
        'eur': 'icon-euro',
        'gumus': 'icon-silver'
      }
      return map[type] || 'icon-default'
    },
    openDeleteModal(item, idx) {
      this.deleteTarget = item
      this.deleteIndex = idx
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    confirmDelete({ amount, description }) {
      this.$emit('delete-item', {
        item: this.deleteTarget,
        amount,
        description
      })
      this.showDeleteModal = false
    },
    getDefaultUnit(type) {
      const unitTranslations = {
        tr: { piece: 'adet', gram: 'gram' },
        en: { piece: 'pcs', gram: 'gram' },
        de: { piece: 'Stück', gram: 'Gramm' }
      }
      const lang = this.$store.state.currentLanguage
      const translations = unitTranslations[lang] || unitTranslations.tr
      
      if (type === 'usd' || type === 'eur' || type === 'ceyrek' || type === 'tam') {
        return translations.piece
      }
      return translations.gram
    },
    formatAmount(amount) {
      const locale = this.$store.state.currentLanguage === 'tr' ? 'tr-TR' : 
                     this.$store.state.currentLanguage === 'de' ? 'de-DE' : 'en-US'
      return amount.toLocaleString(locale, { maximumFractionDigits: 4 })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';

.portfolio-container {
  margin-top: $space-2;
}

/* Modern Empty State */
.empty-state {
  text-align: center;
  padding: $space-12 $space-6;
  margin-top: $space-8;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-2xl;
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
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto $space-6 auto;
  background: $gradient-cool;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-lg;
  
  .material-symbols-outlined {
    font-size: 40px;
    color: $color-text-primary;
  }
}

.empty-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $space-3;
}

.empty-description {
  color: $color-text-secondary;
  font-size: $font-size-base;
  line-height: 1.6;
  max-width: 300px;
  margin: 0 auto;
}

/* Asset List Styles */
.asset-list {
  display: flex;
  flex-direction: column;
  gap: $space-2; // Gap'i azalttım
  
  @media (min-width: 768px) {
    gap: $space-3;
  }
}

.asset-card {
  border-radius: $radius-xl;
  background: transparent;
  transition: $transition-normal;
  
  &:hover .asset-card-content {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
    box-shadow: $shadow-lg;
  }
}

.asset-card-content {
  display: flex;
  align-items: center;
  padding: $space-3; // Padding'i azalttım
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-lg; // Border radius'u küçülttüm
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  min-height: 60px; // Minimum yükseklik belirledim
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  // Tablet ve üzeri için daha fazla padding
  @media (min-width: 768px) {
    padding: $space-4;
    border-radius: $radius-xl;
    min-height: auto;
  }
}

.asset-icon {
  width: 40px; // Mobilde küçük icon
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  margin-right: $space-3; // Margin'i azalttım
  box-shadow: $shadow-sm; // Shadow'u azalttım
  font-size: 18px; // Font size'ı küçülttüm
  flex-shrink: 0; // Icon boyutunu sabit tut
  
  // Tablet ve üzeri için büyük icon
  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    margin-right: $space-4;
    font-size: 20px;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
  }
  
  &.icon-gold {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: $color-text-primary;
  }
  
  &.icon-usd {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: $color-text-primary;
  }
  
  &.icon-euro {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: $color-text-primary;
  }
  
  &.icon-silver {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: $color-text-primary;
  }
  
  &.icon-default {
    background: $gradient-primary;
    color: $color-text-primary;
  }
}

.asset-content {
  flex: 1;
}

.asset-name {
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  font-size: $font-size-sm; // Mobilde küçük font
  margin-bottom: 2px; // Margin'i azalttım
  line-height: 1.1; // Line height'ı azalttım
  
  @media (min-width: 768px) {
    font-size: $font-size-base;
    margin-bottom: $space-1;
    line-height: 1.2;
  }
}

.asset-amount {
  font-size: $font-size-xs; // Mobilde daha küçük
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  line-height: 1.1;
  
  @media (min-width: 768px) {
    font-size: $font-size-sm;
  }
}

.asset-value {
  text-align: right;
  margin-right: $space-2; // Margin'i azalttım
  
  @media (min-width: 768px) {
    margin-right: $space-3;
  }
}

.value-amount {
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  font-size: $font-size-sm; // Mobilde küçük font
  line-height: 1.1; // Line height'ı azalttım
  
  @media (min-width: 768px) {
    font-size: $font-size-base;
    line-height: 1.2;
  }
}

.delete-icon-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: $color-danger;
  font-size: 18px; // Mobilde küçük icon
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-1; // Padding'i azalttım
  border-radius: $radius-sm;
  transition: $transition-normal;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    transform: scale(1.1);
  }
  
  @media (min-width: 768px) {
    font-size: 20px;
    padding: $space-2;
    border-radius: $radius-md;
  }
}
</style>
