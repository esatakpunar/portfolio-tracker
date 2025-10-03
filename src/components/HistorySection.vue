<template>
  <div class="history-section">
    <h2 class="history-title">{{ $t('historyTitle') }}</h2>
    <ul class="history-list">
      <li v-for="(h, i) in history.slice(0, 10)" :key="i" :class="['history-item', h.type]">
        <span class="history-type">
          <span v-if="h.type === 'add'" class="material-symbols-outlined add-icon">add_circle</span>
          <span v-else class="material-symbols-outlined remove-icon">remove_circle</span>
        </span>
        <span class="history-info">
          <b>{{ priceLabel(h.item.type) }}</b> {{ h.item.amount }} {{ h.item.unit }}
          <span>{{ $t(`actionTypes.${h.type}`) }}</span>
          <div v-if="h.description" class="history-desc">{{ h.description }}</div>
        </span>
        <span class="history-date">{{ formatDate(h.date) }}</span>
      </li>
      <li v-if="history.length === 0" class="history-item empty">{{ $t('noHistory') }}</li>
    </ul>
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
      const d = new Date(dateStr)
      const locale = this.$store.state.currentLanguage === 'tr' ? 'tr-TR' : 
                     this.$store.state.currentLanguage === 'de' ? 'de-DE' : 'en-US'
      return d.toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })
    }
  }
}
</script>
<style scoped>
.history-desc {
  color: #888;
  font-size: 0.85em;
  margin-top: 0.1em;
  font-style: italic;
}
</style>
