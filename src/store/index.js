
import { createStore } from 'vuex'
import axios from 'axios'

const PRICES = {
  "22_ayar": 2300,
  "24_ayar": 2500,
  "ceyrek": 4000,
  "tam": 16000,
  "usd": 34,
  "eur": 36,
  "gumus": 30
}

const LOCAL_KEY = 'portfolio_items'

function loadItems() {
  try {
    const data = localStorage.getItem(LOCAL_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}
function saveItems(items) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  } catch (e) {}
}

const HISTORY_KEY = 'portfolio_history'
function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}
function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (e) {}
}

const PRICES_KEY = 'portfolio_prices'
function loadPrices() {
  try {
    const data = localStorage.getItem(PRICES_KEY)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    return {}
  }
}
function savePrices(prices) {
  try {
    localStorage.setItem(PRICES_KEY, JSON.stringify(prices))
  } catch (e) {}
}

export function priceLabel(key) {
  const map = {
    '22_ayar': 'Gram Altın (22 Ayar)',
    '24_ayar': 'Gram Altın (24 Ayar)',
    'ceyrek': 'Çeyrek Altın',
    'tam': 'Tam Altın',
    'usd': 'Dolar (USD)',
    'eur': 'Euro (EUR)',
    'gumus': 'Gümüş (gram)'
  }
  return map[key] || key
}

export default createStore({
  state: {
    items: loadItems(),
    prices: loadPrices(),
    history: loadHistory()
  },
  getters: {
    totalTL: state => state.items.reduce((sum, item) => sum + item.amount * state.prices[item.type], 0),
    totalIn: (state, getters) => (currency) => {
      const gramEquivalents = {
        'ceyrek': 1.75,
        'tam': 7,
        '22_ayar': 1,
        '24_ayar': 1,
      }
      
      return state.items.reduce((sum, item) => {
        const priceTL = state.prices[item.type] || 0
        const itemValueTL = item.amount * priceTL
        
        if (currency === 'TL') {
          return sum + itemValueTL
        } else if (currency === 'USD') {
          return sum + (itemValueTL / (state.prices.usd || 1))
        } else if (currency === 'EUR') {
          return sum + (itemValueTL / (state.prices.eur || 1))
        } else if (currency === 'ALTIN') {
          // Altın türleri için gram karşılığını hesapla
          if (gramEquivalents[item.type]) {
            const gramEquivalent = gramEquivalents[item.type]
            return sum + (item.amount * gramEquivalent)
          } 
          // Para birimleri ve diğer varlıklar için altın karşılığını hesapla
          else {
            return sum + (itemValueTL / (state.prices['24_ayar'] || 1))
          }
        }
        return sum
      }, 0)
    }
  },
  mutations: {
    ADD_ITEM(state, payload) {
      state.items.push(payload)
      saveItems(state.items)
      // History kaydı ekle
      state.history.unshift({
        type: 'add',
        item: payload,
        date: new Date().toISOString(),
        description: payload.description || ''
      })
      saveHistory(state.history)
    },
    REMOVE_ITEM(state, index) {
      const removed = state.items[index]
      state.items.splice(index, 1)
      saveItems(state.items)
      // History kaydı ekle
      if (removed) {
        state.history.unshift({
          type: 'remove',
          item: removed,
          date: new Date().toISOString()
        })
        saveHistory(state.history)
      }
    },
    UPDATE_PRICE(state, { key, value }) {
      state.prices[key] = value
      savePrices(state.prices)
    },
      SET_PRICES(state, prices) {
        state.prices = prices
        savePrices(prices)
      },
    RESET_ALL(state) {
      state.items = []
      state.history = []
      // Fiyatları sıfırlama - güncel fiyatlar korunacak
      saveItems([])
      saveHistory([])
      // savePrices(state.prices) - fiyatları localStorage'dan silmiyoruz
    },
    DECREASE_ITEM_AMOUNT(state, { index, amount, description }) {
      const item = state.items[index]
      if (!item) return
      if (item.amount > amount) {
        item.amount -= amount
      } else {
        state.items.splice(index, 1)
      }
      // History kaydı ekle
      state.history.unshift({
        type: 'remove',
        item: { ...item, amount },
        date: new Date().toISOString(),
        description: description || ''
      })
      saveItems(state.items)
      saveHistory(state.history)
    }
  },
  actions: {
    addItem({ commit }, payload) { commit('ADD_ITEM', payload) },
    removeItem({ commit }, index) { commit('REMOVE_ITEM', index) },
    updatePrice({ commit }, { key, value }) { commit('UPDATE_PRICE', { key, value }) },
    async resetAll({ commit, dispatch }) { 
      commit('RESET_ALL')
      // Reset sonrası güncel fiyatları fetch et
      await dispatch('fetchPrices')
    },
    decreaseItemAmount({ commit }, payload) { commit('DECREASE_ITEM_AMOUNT', payload) },
    async fetchPrices({ commit, state }) {
      try {
        const response = await axios.get('https://finans.truncgil.com/v4/today.json')
        const data = response.data
        // Sadece gerekli key'ler
        const prices = {
          usd: Number(data.USD?.Buying) || state.prices.usd || PRICES.usd,
          eur: Number(data.EUR?.Buying) || state.prices.eur || PRICES.eur,
          gumus: Number(data.GUMUS?.Buying) || state.prices.gumus || PRICES.gumus,
          tam: Number(data.TAMALTIN?.Buying) || state.prices.tam || PRICES.tam,
          ceyrek: Number(data.CEYREKALTIN?.Buying) || state.prices.ceyrek || PRICES.ceyrek,
          "22_ayar": Number(data.YIA?.Buying) || state.prices["22_ayar"] || PRICES["22_ayar"],
          "24_ayar": Number(data.GRA?.Buying) || state.prices["24_ayar"] || PRICES["24_ayar"]
        }
        commit('SET_PRICES', prices)
        console.log('Fiyatlar güncellendi:', prices)
      } catch (error) {
        // Hata durumunda eğer state'te fiyat yoksa mock data kullan
        console.error('Fiyatlar alınamadı:', error)
        if (!state.prices || Object.keys(state.prices).length === 0) {
          console.log('Fallback fiyatlar kullanılıyor')
          commit('SET_PRICES', PRICES)
        }
      }
    }
  }
})
