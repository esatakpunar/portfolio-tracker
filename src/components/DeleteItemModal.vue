<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" :class="{ 'modal--visible': visible }">
      <div class="modal-header">
        <div class="modal-handle"></div>
        <h2 class="modal-title">{{ getAssetLabel() }}</h2>
        <p class="modal-subtitle">
          {{ $t('currentAmount') }}: {{ maxAmount.toFixed(2) }} {{ getUnitText() }}
        </p>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <div class="label-row">
            <label class="form-label">{{ $t('amountToRemove') }}:</label>
            <button @click="setMaxAmount" class="max-button">
              Max: {{ maxAmount.toFixed(2) }}
            </button>
          </div>
          <div class="form-input-with-unit">
            <input 
              type="number" 
              inputmode="decimal"
              pattern="[0-9]*"
              v-model.number="deleteAmount" 
              min="0.0001" 
              :max="maxAmount" 
              step="1"
              class="form-input"
              placeholder="0.00"
            />
            <span class="form-input-unit">{{ getUnitText() }}</span>
          </div>
          <div v-if="deleteAmount && !isValidAmount()" class="error-text">
            {{ $t('invalidAmount') }}
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            {{ $t('description') }} <span class="optional-text">{{ $t('optional') }}</span>
          </label>
          <input 
            v-model="deleteDescription" 
            class="form-input"
            :placeholder="$t('descriptionPlaceholder')"
          />
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn--secondary">
          {{ $t('cancel') }}
        </button>
        <button @click="confirmDelete" class="btn btn--danger" :disabled="!isValidAmount()">
          {{ $t('delete') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { priceLabel } from '../store/index.js'

export default {
  props: {
    visible: Boolean,
    item: Object,
    maxAmount: Number
  },
  data() {
    return {
      deleteAmount: 1,
      deleteDescription: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.deleteAmount = 1
        this.deleteDescription = ''
      }
    }
  },
  computed: {
    isValidAmount() {
      return () => {
        return this.deleteAmount > 0 && this.deleteAmount <= this.maxAmount
      }
    }
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    getUnitText() {
      if (!this.item || !this.item.type) return ''
      const unitTranslations = {
        tr: { piece: 'adet', gram: 'gram' },
        en: { piece: 'pcs', gram: 'gram' },
        de: { piece: 'Stück', gram: 'Gramm' }
      }
      const lang = this.$store.state.currentLanguage
      const translations = unitTranslations[lang] || unitTranslations.tr
      
      if (this.item.type === 'usd' || this.item.type === 'eur') return translations.piece
      if (this.item.type === '24_ayar' || this.item.type === '22_ayar' || this.item.type === 'gumus') return translations.gram
      if (this.item.type === 'ceyrek' || this.item.type === 'tam') return translations.piece
      return this.item.unit || translations.piece
    },
    getAssetLabel() {
      if (!this.item || !this.item.type) return ''
      return this.priceLabel(this.item.type)
    },
    setMaxAmount() {
      this.deleteAmount = this.maxAmount
    },
    confirmDelete() {
      if (!this.isValidAmount()) return
      this.$emit('confirm', { amount: this.deleteAmount, description: this.deleteDescription })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-2;
}

.max-button {
  background: none;
  border: none;
  color: $color-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
}

.error-text {
  font-size: $font-size-sm;
  color: #dc2626;
  margin-top: $space-2;
}

.optional-text {
  font-size: $font-size-sm;
  color: $color-text-muted;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .modal {
    width: 100%;
    margin: 0;
  }
}
</style>
