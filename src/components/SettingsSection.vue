<template>
  <div class="settings-section">
    <h2 class="settings-title">Ayarlar</h2>
    <form class="settings-form">
      <div v-for="(val, key) in editablePrices" :key="key" class="settings-row">
        <label :for="'price-' + key">{{ priceLabel(key) }}</label>
        <input :id="'price-' + key" :value="val" disabled class="settings-price-input" />
      </div>
      </form>
      <button type="button" class="settings-save-btn" @click="refreshPrices">Fiyatları Yenile</button>
    <hr class="settings-divider" />
  <button class="settings-reset-btn" @click="$emit('reset-all')">Tüm Verileri Sıfırla</button>
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
      editablePrices: { ...this.prices }
    }
  },
  watch: {
    prices: {
      handler(newVal) {
        this.editablePrices = { ...newVal }
      },
      immediate: true
    }
  },
  methods: {
    priceLabel,
    async refreshPrices() {
      await this.$store.dispatch('fetchPrices')
      // Fiyatlar güncellendikten sonra inputlar anında güncellensin
      this.editablePrices = { ...this.$store.state.prices }
    }
  }
}
</script>