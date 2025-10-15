<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" :class="{ 'modal--visible': visible }">
      <div class="modal-header">
        <div class="modal-handle"></div>
        <h3 class="modal-title">{{ $t('addNewAsset') }}</h3>
        <p class="modal-subtitle">{{ $t('addNewAssetSubtitle') }}</p>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>{{ $t('assetType') }}</label>
          <select v-model="addType" class="form-select">
            <option disabled value="">{{ $t('selectAssetType') }}</option>
            <option v-for="(label, key) in assetTypes" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>
        
        <div v-if="showUnitInput" class="form-group">
          <label>{{ $t('unit') }}</label>
          <input 
            v-model="addUnit" 
            class="form-input"
            :placeholder="$t('unitPlaceholder')" 
          />
        </div>
        
        <div class="form-group">
          <label>{{ $t('amount') }}</label>
          <div class="form-input-with-unit">
            <input 
              type="number" 
              inputmode="decimal"
              pattern="[0-9]*"
              v-model.number="addAmount" 
              min="0.0001" 
              step="1"
              class="form-input"
              :placeholder="$t('amountPlaceholder')"
            />
            <span class="form-input-unit">{{ getUnitForType(addType) }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label>{{ $t('description') }} <span class="optional">{{ $t('optional') }}</span></label>
          <input 
            v-model="addDescription" 
            class="form-input"
            :placeholder="$t('descriptionPlaceholder')"
          />
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn--secondary">
          {{ $t('cancel') }}
        </button>
        <button @click="confirmAdd" class="btn btn--primary" :disabled="!canAdd">
          {{ $t('add') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    assetTypes: Object
  },
  data() {
    return {
      addType: '',
      addUnit: '',
      addAmount: 1,
      addDescription: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.addType = ''
        this.addUnit = ''
        this.addAmount = 1
        this.addDescription = ''
      }
    }
  },
  computed: {
    showUnitInput() {
      return false
    },
    canAdd() {
      return this.addType && this.addAmount > 0
    }
  },
  methods: {
    confirmAdd() {
      if (!this.canAdd) return
      this.$emit('add', {
        type: this.addType,
        unit: this.addUnit || this.defaultUnitForType(this.addType),
        amount: this.addAmount,
        description: this.addDescription
      })
    },
    defaultUnitForType(type) {
      if (type === 'usd' || type === 'eur' || type === 'tl') return 'adet'
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return 'gr'
      if (type === 'ceyrek' || type === 'tam') return 'adet'
      return ''
    },
    getUnitForType(type) {
      if (!type) return ''
      
      const unitTranslations = {
        tr: { piece: 'adet', gram: 'gram' },
        en: { piece: 'pcs', gram: 'gram' },
        de: { piece: 'Stück', gram: 'Gramm' }
      }
      const lang = this.$store.state.currentLanguage
      const translations = unitTranslations[lang] || unitTranslations.tr
      
      if (type === 'usd') return 'USD'
      if (type === 'eur') return 'EUR'
      if (type === 'tl') return 'TL'
      if (type === 'ceyrek' || type === 'tam') return translations.piece
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return translations.gram
      return translations.gram
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';

label {
  .optional {
    color: $color-text-muted;
    font-weight: $font-weight-normal;
    font-size: $font-size-xs;
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
</style>