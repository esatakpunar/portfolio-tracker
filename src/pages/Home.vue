<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-container">
        <div class="header-content">
          <h1 class="header-title">{{ getHeaderTitle() }}</h1>
          <p class="header-subtitle">{{ getHeaderSubtitle() }}</p>
        </div>
        <div class="header-actions">
          <button v-if="activeTab === 'portfolio'" class="header-add-btn" @click="showAddModal = true">
            <span class="material-symbols-outlined fab-icon">add</span>
          </button>
          <div v-if="activeTab === 'settings'" class="language-selector-header">
            <button class="language-button" @click="toggleLanguageMenu">
              <span class="language-icon">🌐</span>
            </button>
            
            <div v-if="showLanguageMenu" class="language-menu">
              <div 
                v-for="lang in availableLanguages" 
                :key="lang.code"
                class="language-option"
                :class="{ 'selected': selectedLanguage === lang.code }"
                @click="selectLanguage(lang.code)"
              >
                <span class="language-flag">{{ lang.flag }}</span>
                <span class="language-name">{{ lang.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <AddItemModal
      :visible="showAddModal"
      :asset-types="assetTypes"
      @close="showAddModal = false"
      @add="handleAddItem"
    />
    
    <QuickAddModal
      :visible="showQuickAddModal"
      :asset-type="quickAddAssetType"
      :current-amount="quickAddCurrentAmount"
      @close="showQuickAddModal = false"
      @add="handleQuickAdd"
    />
    <!-- Main Content -->
    <main class="main-content" @scroll="handleScroll">
      <div class="content-container">
        <div v-if="activeTab === 'portfolio'" class="portfolio-content animate-fade-in">
          <!-- Total Section with Slider -->
          <div class="total-section">
            <div class="total-slider" 
                 @touchstart="handleTouchStart" 
                 @touchmove="handleTouchMove" 
                 @touchend="handleTouchEnd">
              
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
                    <div 
                      class="gradient-overlay"
                      :style="{ backgroundColor: getCurrencyColor(tab) }"
                    ></div>
                    
                    <div class="total-card-content">
                      <div class="total-card-header">
                        <div 
                          class="currency-icon-container"
                          :style="{ 
                            backgroundColor: getCurrencyColor(tab) + '20',
                            borderColor: getCurrencyColor(tab) + '40'
                          }"
                        >
                          <span 
                            class="currency-icon-text"
                            :style="{ color: getCurrencyColor(tab) }"
                          >
                            {{ getCurrencySymbol(tab) }}
                          </span>
                        </div>
                        <div class="currency-info">
                          <div class="total-label">{{ $t('total') }}</div>
                          <div class="currency-label">{{ getCurrencyName(tab) }}</div>
                        </div>
                      </div>
                      
                      <div class="total-card-body">
                        <div class="total-value-container">
                          <span class="total-value">{{ getTotalValueForCurrency(tab) }}</span>
                          <span class="total-currency-symbol">{{ getCurrencySymbol(tab) }}</span>
                        </div>
                        <div class="value-underline"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
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
            ref="portfolioSection"
            :selected="selected"
            :tabs="tabs"
            :items-with-value="groupedItemsWithValue"
            :total-formatted="totalFormatted"
            @update:selected="updateSelected"
            @delete-item="deleteItem"
            @open-quick-add="handleOpenQuickAdd"
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
import QuickAddModal from '../components/QuickAddModal.vue'
import { availableLanguages } from '../localizations'

export default {
  components: {
    PortfolioSection,
    HistorySection,
    SettingsSection,
    AddItemModal,
    QuickAddModal
  },
  data() {
    return {
      selected: 'TL',
      tabs: ['TL','USD','EUR','ALTIN'],
      activeTab: 'portfolio',
      showAddModal: false,
      showQuickAddModal: false,
      quickAddAssetType: '',
      quickAddCurrentAmount: 0,
      selectedIndex: 0,
      touchStartX: 0,
      touchStartY: 0,
      isSwiping: false,
      availableLanguages,
      selectedLanguage: this.$store.state.currentLanguage,
      showLanguageMenu: false
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
        'ceyrek': 1.75,
        'tam': 7,
        '22_ayar': 1,
        '24_ayar': 1,
      }
    },
    groupedItemsWithValue() {
      const groups = {}
      this.items.forEach(it => {
        const key = it.type + '|' + (it.unit || '')
        if (!groups[key]) {
          groups[key] = { ...it }
        } else {
          groups[key].amount += it.amount
        }
      })
      return Object.values(groups).map(it => {
        let value, formatted

        if (this.selected === 'ALTIN') {
          const goldEquivalent = this.getGoldEquivalent(it)
          if (goldEquivalent) {
            value = goldEquivalent.value
            formatted = goldEquivalent.formatted
          } else {
            const valueTL = this.getValueInTL(it)
            value = this.convertFromTL(valueTL, 'ALTIN')
            formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr'
          }
        } else {
          const valueTL = this.getValueInTL(it)
          value = this.convertFromTL(valueTL, this.selected)
          formatted = this.formatValue(value, this.selected)
        }
        return {
          ...it,
          value: formatted
        }
      })
    },
    assetTypes() {
      return this.$translations.assetTypes
    },
    showUnitInput() {
      return false
    }
  },
  watch: {
    selected(newVal) {
      const index = this.tabs.indexOf(newVal)
      if (index !== -1 && index !== this.selectedIndex) {
        this.selectedIndex = index
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetchPrices')
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleScroll() {
      if (this.$refs.portfolioSection) {
        this.$refs.portfolioSection.closeAllSwipeables()
      }
    },
    getValueInTL(item) {
      if (item.type === 'tl') {
        return item.amount
      } else if (item.type === 'usd') {
        return item.amount * this.prices.usd
      } else if (item.type === 'eur') {
        return item.amount * this.prices.eur
      } else {
        return item.amount * (this.prices[item.type] || 0)
      }
    },

    convertFromTL(valueTL, targetCurrency) {
      switch (targetCurrency) {
        case 'TL':
          return valueTL
        case 'USD':
          return valueTL / (this.prices.usd || 1)
        case 'EUR':
          return valueTL / (this.prices.eur || 1)
        case 'ALTIN':
          return valueTL / (this.prices['24_ayar'] || 1)
        default:
          return valueTL
      }
    },

    formatValue(value, currency) {
      switch (currency) {
        case 'TL':
          return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
        case 'USD':
          return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
        case 'EUR':
          return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
        case 'ALTIN':
          return value.toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' gr altın karşılığı'
        default:
          return value.toString()
      }
    },

    getGoldEquivalent(item) {
      if (this.gramEquivalents[item.type]) {
        const gramEquivalent = this.gramEquivalents[item.type]
        return {
          value: item.amount * gramEquivalent,
          formatted: (item.amount * gramEquivalent).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
        }
      }
      return null
    },

    getCurrencySymbol(currency) {
      const symbols = {
        'TL': '₺',
        'USD': '$',
        'EUR': '€',
        'ALTIN': '₲'
      }
      return symbols[currency] || currency
    },
    
    getCurrencyName(currency) {
      return this.$translations.currencies[currency] || currency
    },
    
    deleteItem({ item, amount, description }) {
      let toRemove = amount
      const indicesToRemove = []
      this.items.forEach((it, idx) => {
        if (toRemove > 0 && it.type === item.type && it.unit === item.unit) {
          const removeCount = Math.min(it.amount, toRemove)
          indicesToRemove.push({ idx, removeCount })
          toRemove -= removeCount
        }
      })
      indicesToRemove.reverse().forEach(({ idx, removeCount }) => {
        this.$store.dispatch('decreaseItemAmount', { index: idx, amount: removeCount, description })
      })
    },

    resetAll() {
      if (confirm(this.$t('confirmDeleteMessage'))) {
        this.$store.dispatch('resetAll')
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
    },
    handleOpenQuickAdd(data) {
      this.quickAddAssetType = data.assetType
      this.quickAddCurrentAmount = data.currentAmount
      this.showQuickAddModal = true
    },
    handleQuickAdd(amount, description) {
      const storeItems = this.$store.state.items
      const defaultUnit = this.getDefaultUnit(this.quickAddAssetType)

      const existingItemIndex = storeItems.findIndex(item =>
        item.type === this.quickAddAssetType &&
        (item.unit === defaultUnit || !item.unit)
      )

      if (existingItemIndex !== -1) {
        const existingItem = storeItems[existingItemIndex]
        const newAmount = existingItem.amount + amount
        this.$store.dispatch('updateItemAmount', {
          index: existingItemIndex,
          newAmount: newAmount,
          description: description,
          isAddition: true,
          amountDelta: amount
        })
      } else {
        this.$store.dispatch('addItem', {
          type: this.quickAddAssetType,
          amount: amount,
          description: description,
          unit: defaultUnit
        })
      }
      this.showQuickAddModal = false
    },
    getDefaultUnit(type) {
      const unitTranslations = {
        tr: { piece: 'adet', gram: 'gr' },
        en: { piece: 'pcs', gram: 'gr' },
        de: { piece: 'Stück', gram: 'gr' }
      }
      const lang = this.$store.state.currentLanguage
      const translations = unitTranslations[lang] || unitTranslations.tr
      
      if (type === 'usd' || type === 'eur' || type === 'tl') return translations.piece
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return translations.gram
      if (type === 'ceyrek' || type === 'tam') return translations.piece
      return translations.piece
    },
    
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
      return this.getCurrencySymbol(currency)
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
    getCurrencyColor(currency) {
      const colors_map = {
        'TL': '#dc2626',
        'USD': '#10b981',
        'EUR': '#3b82f6',
        'ALTIN': '#f59e0b',
      }
      return colors_map[currency]
    },
    getTotalValueForCurrency(currency) {
      const value = this.totalIn(currency)
      return value.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    getHeaderTitle() {
      switch (this.activeTab) {
        case 'portfolio':
          return this.$t('portfolio')
        case 'history':
          return this.$t('historyTitle')
        case 'settings':
          return this.$t('settings')
        default:
          return this.$t('portfolio')
      }
    },
    getHeaderSubtitle() {
      switch (this.activeTab) {
        case 'portfolio':
          return this.$t('portfolioSubtitle')
        case 'history':
          return this.$t('historySubtitle')
        case 'settings':
          return this.$t('settingsSubtitle')
        default:
          return this.$t('portfolioSubtitle')
      }
    },
    
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
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isSwiping = true
        event.preventDefault()
      }
    },
    
    handleTouchEnd(event) {
      if (!this.touchStartX || !this.isSwiping) return
      
      const touchEndX = event.changedTouches[0].clientX
      const deltaX = this.touchStartX - touchEndX
      const minSwipeDistance = 50
      
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.nextCurrency()
        } else {
          this.previousCurrency()
        }
      }
      
      this.touchStartX = 0
      this.touchStartY = 0
      this.isSwiping = false
    },
    changeLanguage() {
      this.$store.dispatch('setLanguage', this.selectedLanguage)
    },
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu
    },
    selectLanguage(langCode) {
      this.selectedLanguage = langCode
      this.$store.dispatch('setLanguage', langCode)
      this.showLanguageMenu = false
    },
    handleClickOutside(event) {
      if (!event.target.closest('.language-selector-header')) {
        this.showLanguageMenu = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $color-bg-primary;
  font-family: $font-family-base;
  position: relative;
  overflow-x: hidden;
}

.app-header {
  position: sticky;
  top: 0;
  backdrop-filter: blur($blur-xl);
  -webkit-backdrop-filter: blur($blur-xl);
  border-bottom: 1px solid $color-border;
  z-index: $z-sticky;
  padding: $space-4;
  transition: $transition-normal;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 $space-4;
  min-height: 44px;
}

.header-content {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-title {
  font-weight: $font-weight-bold;
  font-size: $font-size-3xl;
  background: $color-text-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin: 0 0 4px 0;
  line-height: 1;
  text-align: left;
}

.header-subtitle {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  margin: 0;
  line-height: 1.2;
  text-align: left;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 3.5rem;
  gap: $space-2;
}

.language-selector-header {
  position: relative;
  display: flex;
  align-items: center;
}

.language-button {
  background: rgba(30, 41, 59, 0.8);
  color: #6366f1;
  border: 1px solid #6366f1;
  border-radius: $radius-lg;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: $transition-normal;
  backdrop-filter: blur($blur-sm);
  
  &:hover {
    background: rgba(30, 41, 59, 0.9);
    border-color: #a78bfa;
    color: #a78bfa;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.language-icon {
  font-size: 24px;
  font-weight: $font-weight-bold;
}

.language-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-lg;
  overflow: hidden;
  min-width: 150px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  z-index: 1000;
}

.language-option {
  display: flex;
  align-items: center;
  padding: $space-3 $space-4;
  cursor: pointer;
  transition: $transition-normal;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  &.selected {
    background: rgba(99, 102, 241, 0.15);
    color: #a78bfa;
  }
}

.language-flag {
  font-size: $font-size-lg;
  margin-right: $space-3;
}

.language-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.header-add-btn {
  background: rgba(30, 41, 59, 0.8);
  color: #6366f1;
  border: 1px solid #6366f1;
  border-radius: $radius-lg;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: $transition-normal;
  backdrop-filter: blur($blur-sm);
  
  &:hover {
    background: rgba(30, 41, 59, 0.9);
    border-color: #a78bfa;
    color: #a78bfa;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.fab-icon {
  font-size: 24px;
  font-weight: $font-weight-bold;
  z-index: 1;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 70px;
  animation: fadeIn 0.6s ease-out;
  
  @media (min-width: 768px) {
    padding-bottom: calc($space-20 + $space-4);
  }
}

.content-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 $space-4;
}

.total-section {
  text-align: center;
  padding: $space-4 0;
  margin: $space-4 0;
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
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-2xl;
  overflow: hidden;
  position: relative;
  box-shadow: $shadow-lg;
  flex-shrink: 0;
  min-height: 200px;
  
  &.active {
    transform: scale(1);
  }
  
  &:not(.active) {
    opacity: 0.7;
  }
  
  @media (min-width: 768px) {
    min-height: 220px;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  opacity: 0.1;
  transform: translate(40px, -40px);
}

.total-card-content {
  padding: $space-6;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    padding: $space-8;
  }
}

.total-card-header {
  display: flex;
  align-items: center;
  margin-bottom: $space-6;
}

.currency-icon-container {
  width: 56px;
  height: 56px;
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $space-4;
  border: 2px solid;
}

.currency-icon-text {
  font-size: 28px;
  font-weight: $font-weight-bold;
}

.currency-info {
  flex: 1;
  text-align: left;
}

.total-label {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: $font-weight-medium;
  margin-bottom: 2px;
}

.currency-label {
  font-size: $font-size-lg;
  color: $color-text-primary;
  font-weight: $font-weight-semibold;
}

.total-card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.total-value-container {
  display: flex;
  align-items: baseline;
}

.total-value {
  font-size: 42px;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  letter-spacing: -1px;
  line-height: 50px;
  
  @media (min-width: 768px) {
    font-size: 48px;
    line-height: 56px;
  }
}

.total-currency-symbol {
  font-size: 28px;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
  margin-left: $space-3;
  line-height: 50px;
  
  @media (min-width: 768px) {
    font-size: 32px;
    line-height: 56px;
  }
}

.value-underline {
  width: 60px;
  height: 4px;
  background: $color-primary;
  border-radius: $radius-full;
  margin-top: $space-3;
}


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

.asset-list {
  margin-top: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  position: relative;
  animation: fadeIn 0.8s ease-out;
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
  background: #020617;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
  border-radius: 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  height: 70px;
  
  @media (min-width: 768px) {
    margin: 0 $space-4 $space-4 $space-4;
    border-radius: $radius-2xl $radius-2xl $radius-xl $radius-xl;
    height: 70px;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  flex: 1;
  padding: 0;
  border-radius: $radius-lg;
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  height: 70px;
  
  .material-symbols-outlined {
    font-size: 24px;
    margin-bottom: 2px;
    transition: $transition-normal;
    position: relative;
    z-index: 1;
  }
  
  &:not(.nav-active) {
    color: #64748b;
    
    &:hover {
      color: #cbd5e1;
      transform: translateY(-1px);
    }
  }
  
  @media (min-width: 768px) {
    height: 70px;
    
    .material-symbols-outlined {
      font-size: 24px;
      margin-bottom: 2px;
    }
  }
}

.nav-active {
  color: #667eea;
  
  .material-symbols-outlined {
    text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
}

.nav-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 1;
  margin-top: 0;
  
  @media (min-width: 768px) {
    font-size: 12px;
    letter-spacing: 0.05em;
    margin-top: 0;
  }
}
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

.history-section {
  margin-top: $space-3;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  padding: $space-4;
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
  
  @media (min-width: 768px) {
    min-width: 100px;
    font-size: $font-size-xs;
  }
}
.settings-section {
  margin-top: $space-3;
  background: $color-glass;
  backdrop-filter: blur($blur-md);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  padding: $space-4;
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
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  margin-bottom: $space-3;
  color: $color-text-primary;
  display: flex;
  align-items: center;
  gap: $space-2;
  
  &::before {
    content: '⚙️';
    font-size: $font-size-base;
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
  gap: $space-2;
  
  @media (min-width: 768px) {
    gap: $space-4;
  }
}

.settings-row {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2;
  background: $color-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-md;
  transition: $transition-normal;
  min-height: 50px;
  
  &:hover {
    background: $color-surface-hover;
  }
  
  label {
    flex: 1;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-size: $font-size-xs;
    min-width: 0;
    
    @media (min-width: 768px) {
      font-size: $font-size-sm;
    }
  }
  
  input {
    flex: 1;
    padding: $space-2;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    background: $color-glass;
    color: $color-text-primary;
    backdrop-filter: blur($blur-sm);
    transition: $transition-normal;
    min-width: 0;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
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

