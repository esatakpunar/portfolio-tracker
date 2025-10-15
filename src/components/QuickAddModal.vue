<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" :class="{ 'modal--visible': visible }">
      <div class="modal-header">
        <div class="modal-handle"></div>
        <h2 class="modal-title">{{ getAssetLabel() }}</h2>
        <p class="modal-subtitle">
          {{ $t('currentAmount') }}: {{ currentAmount.toFixed(2) }} {{ getUnit() }}
        </p>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">{{ $t('amountToAdd') }}:</label>
          <div class="form-input-with-unit">
            <input 
              type="number" 
              inputmode="decimal"
              pattern="[0-9]*"
              v-model.number="amount" 
              min="0.0001" 
              step="1"
              class="form-input"
              placeholder="0.00"
            />
            <span class="form-input-unit">{{ getUnit() }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            {{ $t('description') }} <span class="optional-text">{{ $t('optional') }}</span>
          </label>
          <textarea 
            v-model="description" 
            class="form-textarea"
            :placeholder="$t('descriptionPlaceholder')"
            rows="2"
          ></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="handleClose" class="btn btn--secondary">
          {{ $t('cancel') }}
        </button>
        <button @click="handleAdd" class="btn btn--primary" :disabled="!canAdd">
          {{ $t('add') }}
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
    assetType: String,
    currentAmount: Number
  },
  data() {
    return {
      amount: 1,
      description: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.amount = 1
        this.description = ''
      }
    }
  },
  computed: {
    canAdd() {
      const numAmount = parseFloat(this.amount.toString().replace(',', '.'))
      return !isNaN(numAmount) && numAmount > 0
    }
  },
  methods: {
    priceLabel(key) {
      return priceLabel(key, this.$store.state.currentLanguage)
    },
    getAssetLabel() {
      if (!this.assetType) return ''
      return this.priceLabel(this.assetType)
    },
    getUnit() {
      if (!this.assetType) return ''
      
      const unitTranslations = {
        tr: { piece: 'adet', gram: 'gram' },
        en: { piece: 'pcs', gram: 'gram' },
        de: { piece: 'Stück', gram: 'Gramm' }
      }
      const lang = this.$store.state.currentLanguage
      const translations = unitTranslations[lang] || unitTranslations.tr
      
      if (this.assetType === 'usd') return 'USD'
      if (this.assetType === 'eur') return 'EUR'
      if (this.assetType === 'tl') return 'TL'
      if (this.assetType === 'ceyrek' || this.assetType === 'tam') return translations.piece
      if (this.assetType === '24_ayar' || this.assetType === '22_ayar' || this.assetType === 'gumus') return translations.gram
      return translations.gram
    },
    handleAdd() {
      if (!this.canAdd) return
      const numAmount = parseFloat(this.amount.toString().replace(',', '.'))
      this.$emit('add', numAmount, this.description || undefined)
      this.amount = ''
      this.description = ''
      this.$emit('close')
    },
    handleClose() {
      this.amount = 1
      this.description = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.optional-text {
  font-size: $font-size-sm;
  color: $color-text-muted;
  font-style: italic;
}

.form-textarea {
  width: 100%;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: $color-surface;
  color: $color-text-primary;
  font-size: $font-size-base;
  min-height: 60px;
  resize: vertical;
  font-family: $font-family-base;
  backdrop-filter: blur($blur-sm);
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
