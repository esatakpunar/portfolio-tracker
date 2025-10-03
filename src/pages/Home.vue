<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <div class="flex-1 header-actions">
          <button v-if="activeTab === 'portfolio'" class="header-add-btn invisible-btn" tabindex="-1" aria-hidden="true">
            <span class="material-symbols-outlined fab-icon">add</span>
          </button>
        </div>
        <h1 class="header-title">{{ $t('portfolio') }}</h1>
        <div class="flex-1 header-actions">
          <button v-if="activeTab === 'portfolio'" class="header-add-btn" @click="showAddModal = true">
            <span class="material-symbols-outlined fab-icon">add</span>
          </button>
        </div>
      </div>
    </header>
    <AddItemModal
      :visible="showAddModal"
      :asset-types="assetTypes"
      @close="showAddModal = false"
      @add="handleAddItem"
    />
    <!-- Main Content -->
    <main class="main-content">
      <div class="content-container">
        <div v-if="activeTab === 'portfolio'" class="portfolio-content animate-fade-in">
          <!-- Total Section with Slider -->
          <div class="total-section">
            <div class="total-slider" 
                 @touchstart="handleTouchStart" 
                 @touchmove="handleTouchMove" 
                 @touchend="handleTouchEnd">
              
              <!-- Navigation Buttons -->
              <button class="slider-nav slider-nav-left" @click="previousCurrency" :disabled="selectedIndex === 0">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              
              <!-- Slider Container -->
              <div class="slider-container" ref="sliderContainer">
                <div 
                  class="slider-track" 
                  :style="{ transform: `translateX(-${selectedIndex * 100}%)` }"
                >
                  <div 
                    v-for="(tab, index) in tabs" 
                    :key="tab"
                    class="total-card"
                    :class="{ 'active': index === selectedIndex }"
                  >
                    <div class="currency-badge">
                      <div class="currency-symbol">{{ getCurrencySymbol(tab) }}</div>
                      <div class="currency-name">{{ getCurrencyName(tab) }}</div>
                    </div>
                    <div class="total-value">{{ getTotalForCurrency(tab) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Navigation Buttons -->
              <button class="slider-nav slider-nav-right" @click="nextCurrency" :disabled="selectedIndex === tabs.length - 1">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
              
              <!-- Dots Indicator -->
              <div class="slider-dots">
                <button 
                  v-for="(tab, index) in tabs" 
                  :key="`dot-${tab}`"
                  class="slider-dot" 
                  :class="{ 'active': index === selectedIndex }"
                  @click="goToSlide(index)"
                >
                </button>
              </div>
            </div>
          </div>
          
          <!-- Portfolio Items -->
          <PortfolioSection
            :selected="selected"
            :tabs="tabs"
            :items-with-value="groupedItemsWithValue"
            :total-formatted="totalFormatted"
            @update:selected="updateSelected"
            @delete-item="deleteItem"
          />
        </div>
        <HistorySection
          v-else-if="activeTab === 'history'"
          :history="history"
        />
        <SettingsSection
          v-else-if="activeTab === 'settings'"
          :prices="prices"
          @reset-all="resetAll"
        />
      </div>
    </main>
    <!-- Bottom Nav -->
    <div class="bottom-container">
      <nav class="bottom-nav">
        <button :class="['nav-item', { 'nav-active': activeTab === 'portfolio' } ]" @click="activeTab = 'portfolio'">
          <span class="material-symbols-outlined">pie_chart</span>
          <span class="nav-label">{{ $t('portfolio') }}</span>
        </button>
        <button :class="['nav-item', { 'nav-active': activeTab === 'history' } ]" @click="activeTab = 'history'">
          <span class="material-symbols-outlined">history</span>
          <span class="nav-label">{{ $t('history') }}</span>
        </button>
        <button :class="['nav-item', { 'nav-active': activeTab === 'settings' } ]" @click="activeTab = 'settings'">
          <span class="material-symbols-outlined">settings</span>
          <span class="nav-label">{{ $t('settings') }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PortfolioSection from '../components/PortfolioSection.vue'
import HistorySection from '../components/HistorySection.vue'
import SettingsSection from '../components/SettingsSection.vue'
import AddItemModal from '../components/AddItemModal.vue'

export default {
  components: {
    PortfolioSection,
    HistorySection,
    SettingsSection,
    AddItemModal
  },
  data() {
    return {
      selected: 'TL',
      tabs: ['TL','USD','EUR','ALTIN'],
      activeTab: 'portfolio',
      showAddModal: false,
      addType: '',
      addUnit: '',
      addAmount: 1,
      selectedIndex: 0,
      touchStartX: 0,
      touchStartY: 0,
      isSwiping: false
    }
  },
  computed: {
    ...mapState(['items', 'prices', 'history']),
    ...mapGetters(['totalIn']),
    totalFormatted() {
      const value = this.totalIn(this.selected)
      if (this.selected === 'TL') {
        return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
      } else if (this.selected === 'USD') {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      } else if (this.selected === 'EUR') {
        return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
      } else if (this.selected === 'ALTIN') {
        return value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
      }
      return value
    },
    gramEquivalents() {
      return {
        'ceyrek': 1.75,  // 1 çeyrek = 1.75 gram
        'tam': 7,        // 1 tam = 7 gram
        '22_ayar': 1,    // 1 gram = 1 gram
        '24_ayar': 1,    // 1 gram = 1 gram
      }
    },
    groupedItemsWithValue() {
      // itemsWithValue'dan aynı type ve unit'e sahip olanları grupla
      const groups = {}
      this.items.forEach(it => {
        const key = it.type + '|' + (it.unit || '')
        if (!groups[key]) {
          groups[key] = { ...it }
        } else {
          groups[key].amount += it.amount
        }
      })
      // Her grup için value'yu hesapla
      return Object.values(groups).map(it => {
        const priceTL = this.prices[it.type] || 0
        let value = 0
        let formatted = ''
        if (this.selected === 'TL') {
          value = it.amount * priceTL
          formatted = value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
        } else if (this.selected === 'USD') {
          value = (it.amount * priceTL) / this.prices.usd
          formatted = value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
        } else if (this.selected === 'EUR') {
          value = (it.amount * priceTL) / this.prices.eur
          formatted = value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
        } else if (this.selected === 'ALTIN') {
          // Altın türleri için gram karşılığını hesapla
          if (this.gramEquivalents[it.type]) {
            const gramEquivalent = this.gramEquivalents[it.type]
            value = it.amount * gramEquivalent
            formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
          } 
          // Para birimleri ve diğer varlıklar için altın karşılığını hesapla
          else {
            const valueTL = it.amount * priceTL
            value = valueTL / this.prices['24_ayar']
            
            if (it.type === 'gumus') {
              formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr'
            } else {
              formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr'
            }
          }
        }
        return {
          ...it,
          value: formatted
        }
      })
    },
    itemsWithValue() {
      return this.items.map(it => {
        const priceTL = this.prices[it.type] || 0
        let value = 0
        let formatted = ''
        if (this.selected === 'TL') {
          value = it.amount * priceTL
          formatted = value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
        } else if (this.selected === 'USD') {
          value = (it.amount * priceTL) / this.prices.usd
          formatted = value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
        } else if (this.selected === 'EUR') {
          value = (it.amount * priceTL) / this.prices.eur
          formatted = value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
        } else if (this.selected === 'ALTIN') {
          // Altın türleri için gram karşılığını hesapla
          if (this.gramEquivalents[it.type]) {
            const gramEquivalent = this.gramEquivalents[it.type]
            value = it.amount * gramEquivalent
            formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
          } 
          // Para birimleri ve diğer varlıklar için altın karşılığını hesapla
          else {
            const valueTL = it.amount * priceTL
            value = valueTL / this.prices['24_ayar']
            
            if (it.type === 'gumus') {
              formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr altın karşılığı'
            } else {
              formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr altın karşılığı'
            }
          }
        }
        return {
          ...it,
          value: formatted
        }
      })
    },
    assetTypes() {
      // Kullanıcıya gösterilecek varlık türleri
      return this.$translations.assetTypes
    },
    showUnitInput() {
      // Sadece bazı türler için birim sorulsun (ör: altınlar için 'gram', diğerleri için otomatik)
      return false // Gerekirse true yapabilirsin
    }
  },
  watch: {
    selected(newVal) {
      // Selected değeri değiştiğinde slider'ı güncelle
      const index = this.tabs.indexOf(newVal)
      if (index !== -1 && index !== this.selectedIndex) {
        this.selectedIndex = index
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchPrices')
  },
  methods: {
    getCurrencySymbol(currency) {
      const symbols = {
        'TL': '₺',
        'USD': '$',
        'EUR': '€',
        'ALTIN': '🥇'
      }
      return symbols[currency] || currency
    },
    
    getCurrencyName(currency) {
      return this.$translations.currencies[currency] || currency
    },
    
    deleteItem({ item, amount, description }) {
      let toRemove = amount
      // En eski eklenenden başlayarak sil
      const indicesToRemove = []
      this.items.forEach((it, idx) => {
        if (toRemove > 0 && it.type === item.type && it.unit === item.unit) {
          const removeCount = Math.min(it.amount, toRemove)
          indicesToRemove.push({ idx, removeCount })
          toRemove -= removeCount
        }
      })
      // Silme işlemlerini uygula (en sondan başa doğru ki indexler kaymasın)
      indicesToRemove.reverse().forEach(({ idx, removeCount }) => {
        this.$store.dispatch('decreaseItemAmount', { index: idx, amount: removeCount, description })
      })
      this.$toast(this.$t('itemDeleted'), 'success')
    },

    resetAll() {
      if (confirm(this.$t('confirmDeleteMessage'))) {
        this.$store.dispatch('resetAll')
        this.$toast(this.$t('allDataReset'), 'success')
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    },
    updateSelected(tab) {
      this.selected = tab
    },
    handleAddItem(item) {
      this.$store.dispatch('addItem', item)
      this.showAddModal = false
      this.$toast(this.$t('itemAdded'), 'success')
    },
    defaultUnitForType(type) {
      // Otomatik birim ataması
      if (type === 'usd' || type === 'eur') return 'adet'
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return 'gr'
      if (type === 'ceyrek' || type === 'tam') return 'adet'
      return ''
    },
    
    // Slider Methods
    nextCurrency() {
      if (this.selectedIndex < this.tabs.length - 1) {
        this.selectedIndex++
        this.updateSelectedCurrency()
      }
    },
    
    previousCurrency() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--
        this.updateSelectedCurrency()
      }
    },
    
    goToSlide(index) {
      this.selectedIndex = index
      this.updateSelectedCurrency()
    },
    
    updateSelectedCurrency() {
      this.selected = this.tabs[this.selectedIndex]
    },
    
    getCurrencyIcon(currency) {
      const icons = {
        'TL': '₺',
        'USD': '$',
        'EUR': '€',
        'ALTIN': '🥇'
      }
      return icons[currency] || '💰'
    },
    

    
    getTotalForCurrency(currency) {
      const value = this.totalIn(currency)
      if (currency === 'TL') {
        return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
      } else if (currency === 'USD') {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      } else if (currency === 'EUR') {
        return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
      } else if (currency === 'ALTIN') {
        return value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
      }
      return value
    },
    
    // Touch Events
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX
      this.touchStartY = event.touches[0].clientY
      this.isSwiping = false
    },
    
    handleTouchMove(event) {
      if (!this.touchStartX) return
      
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const deltaX = this.touchStartX - touchX
      const deltaY = this.touchStartY - touchY
      
      // Yatay swipe mı dikey swipe mı kontrol et
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isSwiping = true
        event.preventDefault() // Scroll'u engelle
      }
    },
    
    handleTouchEnd(event) {
      if (!this.touchStartX || !this.isSwiping) return
      
      const touchEndX = event.changedTouches[0].clientX
      const deltaX = this.touchStartX - touchEndX
      const minSwipeDistance = 50
      
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Sola swipe - sonraki currency
          this.nextCurrency()
        } else {
          // Sağa swipe - önceki currency
          this.previousCurrency()
        }
      }
      
      this.touchStartX = 0
      this.touchStartY = 0
      this.isSwiping = false
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

/* Modern App Container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $color-bg-primary;
  font-family: $font-family-base;
  position: relative;
  overflow-x: hidden;
}

/* Modern Header with Glass Effect */
.app-header {
  position: sticky;
  top: 0;
  background: $color-glass;
  backdrop-filter: blur($blur-xl);
  -webkit-backdrop-filter: blur($blur-xl);
  border-bottom: 1px solid $color-border;
  z-index: $z-sticky;
  padding: $space-4 0;
  transition: $transition-normal;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 $space-4;
  min-height: 44px; // Header'a minimum yükseklik ver
}

.header-title {
  font-weight: $font-weight-extrabold;
  font-size: $font-size-2xl;
  text-align: center;
  flex: 1;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin: 0; // Portfolio yazısının margin'ini kaldır
  line-height: 1; // Line height'ı düzelt
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 3.5rem;
}

.header-add-btn {
  background: $gradient-primary;
  color: $color-text-primary;
  border: none;
  border-radius: $radius-full;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: $shadow-md, $shadow-glow;
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: $transition-normal;
  }
  
  &:hover {
    transform: scale(1.05) translateY(-1px);
    box-shadow: $shadow-lg, $shadow-glow;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: scale(1.02);
  }
}

.fab-icon {
  font-size: 20px;
  z-index: 1;
}

.invisible-btn {
  opacity: 0;
  pointer-events: none;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 70px; // Navbar yüksekliği + biraz extra space
  animation: fadeIn 0.6s ease-out;
  
  // Tablet ve üzeri için daha fazla padding
  @media (min-width: 768px) {
    padding-bottom: calc($space-20 + $space-4);
  }
}

.content-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 $space-4;
}

/* Modern Total Slider */
.total-section {
  text-align: center;
  padding: $space-4 0; // Padding'i azalttım
  margin: $space-4 0; // Margin'i azalttım
}

.total-slider {
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.slider-container {
  overflow: hidden;
  border-radius: $radius-2xl;
  position: relative;
}

.slider-track {
  display: flex;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.total-card {
  min-width: 100%;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  padding: $space-6; // Padding'i azalttım
  box-shadow: $shadow-xl, $shadow-glow;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  min-height: 140px; // Minimum yükseklik
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  &.active {
    transform: scale(1);
  }
  
  &:not(.active) {
    opacity: 0.7;
  }
  
  @media (min-width: 768px) {
    padding: $space-8;
    min-height: 160px;
  }
}

.total-value {
  font-size: $font-size-2xl;
  font-weight: $font-weight-extrabold;
  color: $color-text-primary;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: $font-size-3xl;
  }
}

.currency-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  margin-bottom: $space-2;
}

.currency-symbol {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1;
  
  @media (min-width: 768px) {
    font-size: $font-size-3xl;
  }
}

.currency-name {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  line-height: 1;
  
  @media (min-width: 768px) {
    font-size: $font-size-sm;
  }
}

/* Navigation Buttons */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur($blur-sm);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-full;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-primary;
  cursor: pointer;
  transition: $transition-normal;
  z-index: 2;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.05);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .material-symbols-outlined {
    font-size: 20px;
  }
  
  &.slider-nav-left {
    left: $space-2;
  }
  
  &.slider-nav-right {
    right: $space-2;
  }
}

/* Dots Indicator */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: $space-2;
  margin-top: $space-4;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: $transition-fast;
  
  &.active {
    background: $color-text-primary;
    transform: scale(1.2);
  }
  
  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.5);
  }
}

/* Modern Asset List */
.asset-list {
  margin-top: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  position: relative;
  animation: fadeIn 0.8s ease-out;
}

.ios-swipe {
  position: relative;
  overflow: visible;
  background: transparent;
  border-radius: $radius-xl;
}

.swipe-delete-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1));
  border-radius: $radius-xl;
}

.ios-delete-btn {
  margin-right: $space-4;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: $color-text-primary;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  padding: $space-3 $space-6;
  box-shadow: $shadow-lg;
  pointer-events: auto;
  transition: $transition-normal;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-xl, 0 0 20px rgba(239, 68, 68, 0.3);
  }
}

.asset-card-content {
  position: relative;
  z-index: 1;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  padding: $space-4;
  transition: $transition-normal;
  
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

.asset-card {
  position: relative;
  border-radius: $radius-xl;
  background: transparent;
  margin-bottom: $space-1;
  transition: $transition-normal;
  
  &:hover .asset-card-content {
    background: $color-surface-hover;
    transform: translateX(4px);
    box-shadow: $shadow-lg;
  }
  
  &.swiped .asset-card-content {
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
  box-shadow: $shadow-md;
  font-size: 20px;
  transition: $transition-normal;
}

.icon-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: $color-text-primary;
}

.icon-usd {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: $color-text-primary;
}

.icon-euro {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: $color-text-primary;
}

.icon-silver {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: $color-text-primary;
}

.asset-info {
  flex-grow: 1;
}

.asset-name {
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  font-size: $font-size-base;
  margin-bottom: $space-1;
  line-height: 1.2;
}

.asset-amount {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
}

.asset-value {
  text-align: right;
  
  p {
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    font-size: $font-size-base;
    margin: 0;
    line-height: 1.2;
  }
}

/* Delete Button */
.delete-btn {
  position: absolute;
  right: $space-4;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: $color-text-primary;
  border: none;
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  font-weight: $font-weight-bold;
  font-size: $font-size-xs;
  cursor: pointer;
  z-index: 2;
  box-shadow: $shadow-md;
  transition: $transition-normal;
  
  &:hover {
    transform: translateY(-50%) translateY(-1px);
    box-shadow: $shadow-lg, 0 0 15px rgba(239, 68, 68, 0.3);
  }
}

/* Modern Bottom Navigation */
.bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: $space-2 0 calc($space-2 + env(safe-area-inset-bottom, 0px));
  background: $color-glass;
  backdrop-filter: blur($blur-xl);
  -webkit-backdrop-filter: blur($blur-xl);
  border-top: 1px solid $color-border;
  margin: 0; // Mobilde margin kaldır
  border-radius: 0; // Mobilde border-radius kaldır
  box-shadow: $shadow-xl;
  position: relative;
  min-height: 60px; // Minimum yükseklik belirle
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  // Tablet ve üzeri için styling
  @media (min-width: 768px) {
    margin: 0 $space-4 $space-4 $space-4;
    border-radius: $radius-2xl $radius-2xl $radius-xl $radius-xl;
    padding: $space-3 0 calc($space-3 + env(safe-area-inset-bottom, 0));
    
    &::before {
      border-radius: $radius-2xl $radius-2xl 0 0;
    }
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  flex: 1;
  padding: $space-1 $space-2; // Padding'i küçült
  border-radius: $radius-lg;
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $gradient-primary;
    opacity: 0;
    border-radius: $radius-lg;
    transition: $transition-normal;
  }
  
  .material-symbols-outlined {
    font-size: 20px; // Icon boyutunu küçült
    margin-bottom: 2px; // Margin'i azalt
    transition: $transition-normal;
    position: relative;
    z-index: 1;
  }
  
  &:not(.nav-active) {
    color: $color-text-muted;
    
    &:hover {
      color: $color-text-secondary;
      transform: translateY(-1px);
      
      &::before {
        opacity: 0.05;
      }
    }
  }
  
  // Tablet ve üzeri için büyük boyutlar
  @media (min-width: 768px) {
    padding: $space-2;
    
    .material-symbols-outlined {
      font-size: 24px;
      margin-bottom: $space-1;
    }
  }
}

.nav-active {
  color: $color-text-primary;
  
  &::before {
    opacity: 0.15;
  }
  
  .material-symbols-outlined {
    text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  }
}

.nav-label {
  font-size: 10px; // Daha küçük font boyutu
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.02em; // Letter spacing'i azalt
  position: relative;
  z-index: 1;
  
  // Tablet ve üzeri için büyük boyut
  @media (min-width: 768px) {
    font-size: $font-size-xs;
    letter-spacing: 0.05em;
  }
}
/* Delete Icon Button */
.delete-icon-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: $space-2;
  color: $color-danger;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-2;
  border-radius: $radius-md;
  transition: $transition-normal;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    transform: scale(1.1);
  }
}

/* Modern History Section */
.history-section {
  margin-top: $space-3; // Margin'i azalttım
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl; // Border radius'u küçülttüm
  box-shadow: $shadow-lg;
  padding: $space-4; // Padding'i azalttım
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
  
  @media (min-width: 768px) {
    margin-top: $space-8;
    padding: $space-6;
    border-radius: $radius-2xl;
  }
}

.history-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  margin-bottom: $space-4;
  color: $color-text-primary;
  display: flex;
  align-items: center;
  gap: $space-2;
  
  &::before {
    content: '📊';
    font-size: $font-size-lg;
  }
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.history-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3;
  background: $color-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 56px;
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
    background: $color-surface-hover;
    transform: translateX(4px) translateY(-1px);
    border-color: $color-border;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  &.empty {
    color: $color-text-muted;
    justify-content: center;
    font-style: italic;
    padding: $space-8;
    min-height: auto;
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 767px) {
    gap: $space-2;
    padding: $space-2;
    border-radius: $radius-md;
    font-size: $font-size-xs;
    min-height: 48px;
    
    &.empty {
      padding: $space-6;
    }
  }
}

.history-type {
  flex-shrink: 0;
  
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: $radius-lg;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask-composite: xor;
    }
    
    .material-symbols-outlined {
      font-size: 18px;
      font-weight: 600;
      z-index: 1;
      transition: transform 0.2s ease;
    }
    
    &:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      
      .material-symbols-outlined {
        transform: scale(1.1);
      }
    }
    
    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
      
      .material-symbols-outlined {
        font-size: 20px;
      }
    }
  }
}

.add-icon {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  color: white;
  box-shadow: 
    0 4px 15px rgba(16, 185, 129, 0.3),
    0 2px 8px rgba(16, 185, 129, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%);
    box-shadow: 
      0 6px 20px rgba(16, 185, 129, 0.4),
      0 3px 12px rgba(16, 185, 129, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.remove-icon {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
  color: white;
  box-shadow: 
    0 4px 15px rgba(239, 68, 68, 0.3),
    0 2px 8px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%);
    box-shadow: 
      0 6px 20px rgba(239, 68, 68, 0.4),
      0 3px 12px rgba(239, 68, 68, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.history-info {
  flex: 1;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  line-height: 1.4;
  
  b {
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
  }
}

.history-date {
  color: $color-text-muted;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  min-width: 85px;
  text-align: right;
  letter-spacing: 0.025em;
  background: rgba(255, 255, 255, 0.02);
  padding: 4px 8px;
  border-radius: $radius-sm;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (min-width: 768px) {
    min-width: 100px;
    font-size: $font-size-xs;
  }
}
/* Modern Settings Section */
.settings-section {
  margin-top: $space-3; // Margin'i azalttım
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl; // Border radius'u küçülttüm
  box-shadow: $shadow-lg;
  padding: $space-4; // Padding'i azalttım
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
  
  @media (min-width: 768px) {
    margin-top: $space-8;
    padding: $space-6;
    border-radius: $radius-2xl;
  }
}

.settings-title {
  font-size: $font-size-lg; // Font size'ı küçülttüm
  font-weight: $font-weight-bold;
  margin-bottom: $space-3; // Margin'i azalttım
  color: $color-text-primary;
  display: flex;
  align-items: center;
  gap: $space-2;
  
  &::before {
    content: '⚙️';
    font-size: $font-size-base; // Icon size'ı küçülttüm
  }
  
  @media (min-width: 768px) {
    font-size: $font-size-xl;
    margin-bottom: $space-4;
    
    &::before {
      font-size: $font-size-lg;
    }
  }
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: $space-2; // Gap'i azalttım
  
  @media (min-width: 768px) {
    gap: $space-4;
  }
}

.settings-row {
  display: flex;
  align-items: center;
  gap: $space-2; // Gap'i azalttım
  padding: $space-2; // Padding'i azalttım
  background: $color-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-md; // Border radius'u küçülttüm
  transition: $transition-normal;
  min-height: 50px; // Minimum yükseklik
  
  &:hover {
    background: $color-surface-hover;
  }
  
  label {
    flex: 1;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-size: $font-size-xs; // Font size'ı küçülttüm
    min-width: 0; // Flex ile küçülmesine izin ver
    
    @media (min-width: 768px) {
      font-size: $font-size-sm;
    }
  }
  
  input {
    flex: 1;
    padding: $space-2; // Padding'i azalttım
    border: 1px solid $color-border;
    border-radius: $radius-sm; // Border radius'u küçülttüm
    font-size: $font-size-xs; // Font size'ı küçülttüm
    background: $color-glass;
    color: $color-text-primary;
    backdrop-filter: blur($blur-sm);
    transition: $transition-normal;
    min-width: 0; // Flex ile küçülmesine izin ver
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); // Shadow'u küçülttüm
      background: $color-surface-hover;
    }
    
    &::placeholder {
      color: $color-text-muted;
    }
    
    @media (min-width: 768px) {
      padding: $space-3;
      font-size: $font-size-sm;
      border-radius: $radius-md;
    }
  }
  
  @media (min-width: 768px) {
    gap: $space-4;
    padding: $space-3;
    border-radius: $radius-lg;
    min-height: auto;
  }
}

.settings-save-btn {
  margin-top: $space-4;
  background: $gradient-primary;
  color: $color-text-primary;
  border: none;
  border-radius: $radius-lg;
  padding: $space-4 $space-6;
  font-weight: $font-weight-bold;
  cursor: pointer;
  font-size: $font-size-base;
  transition: $transition-normal;
  width: 100%;
  box-shadow: $shadow-md, $shadow-glow;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: $transition-normal;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-lg, $shadow-glow;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.settings-divider {
  margin: $space-6 0 $space-4 0;
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, $color-border, transparent);
}

.settings-reset-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: $color-text-primary;
  border: none;
  border-radius: $radius-lg;
  padding: $space-4 $space-6;
  font-weight: $font-weight-bold;
  cursor: pointer;
  font-size: $font-size-base;
  transition: $transition-normal;
  width: 100%;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: $transition-normal;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-lg, 0 0 20px rgba(239, 68, 68, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}
/* Modern Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur($blur-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal-backdrop;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: $color-bg-secondary;
  border: 1px solid $color-border;
  border-radius: $radius-2xl;
  padding: $space-8;
  box-shadow: $shadow-2xl;
  min-width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideInUp 0.3s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    border-radius: $radius-2xl $radius-2xl 0 0;
  }
  
  .modal-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $space-6;
    text-align: center;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  label {
    display: block;
    margin: $space-4 0 $space-2 0;
    font-weight: $font-weight-semibold;
    text-align: left;
    color: $color-text-primary;
    font-size: $font-size-sm;
  }
  
  input, select {
    width: 100%;
    font-size: $font-size-base;
    padding: $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    margin-bottom: $space-3;
    background: $color-surface;
    color: $color-text-primary;
    backdrop-filter: blur($blur-sm);
    font-family: $font-family-base;
    transition: $transition-normal;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      background: $color-surface-hover;
    }
    
    &::placeholder {
      color: $color-text-muted;
    }
  }
  
  select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right $space-3 center;
    background-repeat: no-repeat;
    background-size: 16px 12px;
    padding-right: $space-10;
  }
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: $space-3;
  margin-top: $space-6;
}

.modal-confirm {
  background: $gradient-primary;
  color: $color-text-primary;
  border: none;
  border-radius: $radius-lg;
  padding: $space-3 $space-6;
  font-weight: $font-weight-bold;
  cursor: pointer;
  font-size: $font-size-base;
  transition: $transition-normal;
  box-shadow: $shadow-md, $shadow-glow;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: $transition-normal;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-lg, $shadow-glow;
    
    &::before {
      left: 100%;
    }
  }
}

.modal-cancel {
  background: $color-surface;
  color: $color-text-secondary;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-3 $space-6;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  font-size: $font-size-base;
  transition: $transition-normal;
  backdrop-filter: blur($blur-sm);
  
  &:hover {
    background: $color-surface-hover;
    color: $color-text-primary;
    border-color: $color-primary;
    transform: translateY(-1px);
  }
}
</style>
