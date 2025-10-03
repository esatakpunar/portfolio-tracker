<template>
  <div class="settings-section">
    <h2 class="settings-title">{{ $t('settingsTitle') }}</h2>
    <form class="settings-form">
      <div v-for="(val, key) in editablePrices" :key="key" class="settings-row">
        <label :for="'price-' + key">{{ priceLabel(key) }}</label>
        <input :id="'price-' + key" :value="val" disabled class="settings-price-input" />
      </div>
      </form>
      <button type="button" class="settings-save-btn" @click="refreshPrices">{{ $t('refreshPrices') }}</button>
      
    <hr class="settings-divider" />
    
    <!-- Language Selection -->
    <div class="settings-row language-row">
      <label class="language-label">
        <span class="material-symbols-outlined">language</span>
        {{ $t('language') }}
      </label>
      <select v-model="selectedLanguage" @change="changeLanguage" class="language-select">
        <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
          {{ lang.flag }} {{ lang.name }}
        </option>
      </select>
    </div>
    
    <hr class="settings-divider" />
    <button class="settings-reset-btn" @click="$emit('reset-all')">{{ $t('resetAllData') }}</button>
  </div>
</template>
<script>
import { priceLabel } from '../store/index.js'
import { availableLanguages } from '../localizations'
export default {
  props: {
    prices: Object
  },
  data() {
    return {
      editablePrices: { ...this.prices },
      availableLanguages,
      selectedLanguage: this.$store.state.currentLanguage
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
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    async refreshPrices() {
      await this.$store.dispatch('fetchPrices')
      // Fiyatlar güncellendikten sonra inputlar anında güncellensin
      this.editablePrices = { ...this.$store.state.prices }
      this.$toast(this.$t('pricesRefreshed'), 'success')
    },
    changeLanguage() {
      this.$store.dispatch('setLanguage', this.selectedLanguage)
      this.$toast(this.$t('languageChanged'), 'success')
    }
  }
}
</script>