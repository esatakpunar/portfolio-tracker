<template>
  <div v-if="itemsWithValue.length > 0" class="asset-list">
    <SwipeableAssetCard
      v-for="(it, i) in itemsWithValue"
      :key="`${it.type}-${it.unit || 'default'}`"
      :ref="`swipeableCard-${i}`"
      :item="it"
      :on-edit="() => handleEdit(it, i)"
      :on-delete="() => handleDelete(it, i)"
      :on-swipeable-will-open="handleSwipeableWillOpen"
      @card-click="openQuickAddModal"
    />
  </div>
  
  <div v-else class="empty-state">
    <div class="empty-icon-container">
      <span class="empty-icon">💰</span>
    </div>
    <h3 class="empty-state-title">{{ $t('noAssets') }}</h3>
    <p class="empty-state-subtitle">{{ $t('addFirstAsset') }}</p>
  </div>
  
  <DeleteItemModal
    :visible="showDeleteModal"
    :item="deleteTarget"
    :max-amount="deleteTarget.amount"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>

<script>
import DeleteItemModal from './DeleteItemModal.vue'
import SwipeableAssetCard from './SwipeableAssetCard.vue'
import { priceLabel } from '../store/index.js'
export default {
  components: { DeleteItemModal, SwipeableAssetCard },
  emits: ['update:selected', 'delete-item', 'open-quick-add'],
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
      deleteIndex: null,
      currentlyOpenSwipeable: null
    }
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
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
    },
    handleEdit(item, idx) {
      this.deleteTarget = item
      this.deleteIndex = idx
      this.showDeleteModal = true
    },
    handleDelete(item, idx) {
      this.deleteTarget = item
      this.deleteIndex = idx
      this.showDeleteModal = true
    },
    handleSwipeableWillOpen(assetType) {
      if (this.currentlyOpenSwipeable !== null && this.currentlyOpenSwipeable !== assetType) {
        Object.keys(this.$refs).forEach(refKey => {
          if (refKey.startsWith('swipeableCard-') && this.$refs[refKey] && this.$refs[refKey][0]) {
            const cardComponent = this.$refs[refKey][0]
            if (cardComponent.isSwiped && cardComponent.item.type === this.currentlyOpenSwipeable) {
              cardComponent.close()
            }
          }
        })
      }
      this.currentlyOpenSwipeable = assetType
    },
    closeAllSwipeables() {
      Object.keys(this.$refs).forEach(refKey => {
        if (refKey.startsWith('swipeableCard-') && this.$refs[refKey] && this.$refs[refKey][0]) {
          const cardComponent = this.$refs[refKey][0]
          if (cardComponent.isSwiped) {
            cardComponent.close()
          }
        }
      })
      this.currentlyOpenSwipeable = null
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
    openQuickAddModal(item) {
      this.$emit('open-quick-add', {
        assetType: item.type,
        currentAmount: item.amount
      })
    },
    getDefaultUnit(type) {
      if (type === 'usd' || type === 'eur' || type === 'tl' || type === 'ceyrek' || type === 'tam') {
        return this.$t('units.piece')
      }
      return this.$t('units.gram')
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

.asset-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: $space-6;
}
</style>
