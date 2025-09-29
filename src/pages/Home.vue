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
        <h1 class="header-title">Portfolio</h1>
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
        <PortfolioSection
          v-if="activeTab === 'portfolio'"
          :selected="selected"
          :tabs="tabs"
          :items-with-value="groupedItemsWithValue"
          :total-formatted="totalFormatted"
          @update:selected="updateSelected"
          @delete-item="deleteItem"
        />
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
          <span class="nav-label">Portfolio</span>
        </button>
        <button :class="['nav-item', { 'nav-active': activeTab === 'history' } ]" @click="activeTab = 'history'">
          <span class="material-symbols-outlined">history</span>
          <span class="nav-label">History</span>
        </button>
        <button :class="['nav-item', { 'nav-active': activeTab === 'settings' } ]" @click="activeTab = 'settings'">
          <span class="material-symbols-outlined">settings</span>
          <span class="nav-label">Settings</span>
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
      addAmount: 1
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
          value = (it.amount * priceTL) / this.prices['24_ayar']
          formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
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
          value = (it.amount * priceTL) / this.prices['24_ayar']
          formatted = value.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' gr'
        }
        return {
          ...it,
          value: formatted
        }
      })
    },
    assetTypes() {
      // Kullanıcıya gösterilecek varlık türleri
      return {
        '24_ayar': 'Gram Altın (24 Ayar)',
        '22_ayar': 'Gram Altın (22 Ayar)',
        'ceyrek': 'Çeyrek Altın',
        'tam': 'Tam Altın',
        'usd': 'Dolar (USD)',
        'eur': 'Euro (EUR)',
        'gumus': 'Gümüş (gram)'
      }
    },
    showUnitInput() {
      // Sadece bazı türler için birim sorulsun (ör: altınlar için 'gram', diğerleri için otomatik)
      return false // Gerekirse true yapabilirsin
    }
  },
  methods: {
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
    },
    mounted() {
      // Sayfa ilk açıldığında fiyatları fetch et
      this.$store.dispatch('fetchPrices')
    },
    resetAll() {
      if (confirm('Tüm veriler silinecek. Emin misiniz?')) {
        this.$store.dispatch('resetAll')
        this.$toast && this.$toast.success('Tüm veriler sıfırlandı!')
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
    defaultUnitForType(type) {
      // Otomatik birim ataması
      if (type === 'usd' || type === 'eur') return 'adet'
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return 'gr'
      if (type === 'ceyrek' || type === 'tam') return 'adet'
      return ''
    }
  }
}
</script>

<style lang="scss">
/* Container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f8f6;
  font-family: 'Inter', sans-serif;
}

/* Header */
.app-header {
  position: sticky;
  top: 0;
  background: rgba(246,248,246,0.95);
  backdrop-filter: blur(8px);
  z-index: 10;
  padding: 1rem 0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-title {
  font-weight: 700;
  font-size: 1.25rem;
  text-align: center;
  flex: 1;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 3.5rem;
}
.header-add-btn {
  background: #17cf17;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}
.header-add-btn:hover {
  background: #13b013;
}
.fab-icon {
  font-size: 1.7rem;
}
.header-actions a {
  text-decoration: none;
}

/* Main */
.main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 6rem;
}

.content-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1rem;
}

.total-section {
  text-align: center;
  padding: 2rem 0;
}

.total-label {
  color: #555;
  font-size: 0.875rem;
}

.total-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ccc;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.75rem 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: #555;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: 0.2s;
}

.tab-active {
  border-color: #17cf17;
  color: #17cf17;
}

/* Asset List */
.asset-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}
.ios-swipe {
  position: relative;
  overflow: visible;
  background: transparent;
}
.swipe-delete-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 0;
  pointer-events: none;
}
.ios-delete-btn {
  margin-right: 1rem;
  background: #ff3b30;
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 8px rgba(255,59,48,0.15);
  pointer-events: auto;
  transition: background 0.2s;
}
.asset-card-content {
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.5);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0.75rem;
}

.asset-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.1rem;
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.5);
  margin-bottom: 0.1rem;
}
.asset-card.swiped {
  background: #ffeaea;
}

.asset-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
}

.icon-gold { background-color: rgba(23,207,23,0.1); color: #17cf17; }
.icon-usd { background-color: rgba(23,207,23,0.1); color: #17cf17; }
.icon-euro { background-color: rgba(23,207,23,0.1); color: #17cf17; }
.icon-silver { background-color: rgba(0,0,0,0.05); color: rgba(0,0,0,0.4); }

.asset-info { flex-grow: 1; }
.asset-name { 
  font-weight: 700;
   color: #000;
   font-size: 14px;
    }
.asset-amount { font-size: 14px; color: #555; }

.asset-value p { font-weight: 700; text-align: right; font-size: 14px; }

.delete-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 4rem;
  right: 1rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #17cf17;
  color: #fff;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(23,207,23,0.3);
  cursor: pointer;
  border: none;
}

/* Bottom Nav */
.bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
  background: rgba(246,248,246,0.95);
  border-top: 1px solid #ccc;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555;
  font-size: 1.3rem;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  flex: 1;
  padding: 0.3rem 0;
  transition: color 0.2s;
}

.nav-active {
  color: #17cf17;
}
.nav-label {
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.1rem;
}
.delete-icon-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 0.5rem;
  color: #ff4d4f;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}
.delete-icon-btn:hover {
  color: #d32f2f;
}
.history-section {
  margin-top: 2.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.25rem 1rem 1rem 1rem;
}
.history-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #222;
}
.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.97rem;
}
.history-item:last-child {
  border-bottom: none;
}
.history-type {
  display: flex;
  align-items: center;
}
.add-icon {
  color: #17cf17;
  font-size: 1.3rem;
}
.remove-icon {
  color: #ff4d4f;
  font-size: 1.3rem;
}
.history-info {
  flex: 1;
}
.history-date {
  color: #888;
  font-size: 0.85rem;
  min-width: 90px;
  text-align: right;
}
.history-item.empty {
  color: #aaa;
  justify-content: center;
}
.settings-section {
  margin-top: 2.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.25rem 1rem 1rem 1rem;
}
.settings-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #222;
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.settings-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.settings-row label {
  flex: 1;
  font-weight: 500;
}
.settings-row input {
  flex: 1;
  padding: 0.4rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}
.settings-save-btn {
  margin-top: 1rem;
  background: #17cf17;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  width: 100%;
}
.settings-save-btn:hover {
  background: #13b013;
}
.settings-divider {
  margin: 1.5rem 0 1rem 0;
  border: none;
  border-top: 1px solid #eee;
}
.settings-reset-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  width: 100%;
}
.settings-reset-btn:hover {
  background: #d32f2f;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  min-width: 260px;
  max-width: 90vw;
  text-align: center;
}
.modal label {
  display: block;
  margin: 1rem 0 0.5rem 0;
  font-weight: 500;
  text-align: left;
}
.modal input, .modal select {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.modal-confirm {
  background: #17cf17;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
.modal-cancel {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
.invisible-btn {
  opacity: 0;
  pointer-events: none;
}
</style>
