<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-icon">
          <span class="material-symbols-outlined">add_circle</span>
        </div>
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
          <input 
            type="number" 
            v-model.number="addAmount" 
            min="0.0001" 
            step="0.0001"
            class="form-input"
            :placeholder="$t('amountPlaceholder')"
          />
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
          <span class="material-symbols-outlined">close</span>
          {{ $t('cancel') }}
        </button>
        <button @click="confirmAdd" class="btn btn--primary" :disabled="!canAdd">
          <span class="material-symbols-outlined">add</span>
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';

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
  padding: 0;
  box-shadow: $shadow-2xl;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: slideInUp 0.3s ease-out;
  position: relative;
  
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

.modal-header {
  padding: $space-8 $space-6 $space-6 $space-6;
  text-align: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-bottom: 1px solid $color-border;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto $space-4 auto;
  background: $gradient-primary;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-lg, $shadow-glow;
  
  .material-symbols-outlined {
    font-size: 32px;
    color: $color-text-primary;
  }
}

.modal-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $space-2;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  margin: 0;
}

.modal-body {
  padding: $space-6;
}

.form-group {
  margin-bottom: $space-5;
  
  &:last-child {
    margin-bottom: 0;
  }
}

label {
  display: block;
  margin-bottom: $space-2;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  font-size: $font-size-sm;
  
  .optional {
    color: $color-text-muted;
    font-weight: $font-weight-normal;
    font-size: $font-size-xs;
  }
}

.form-input, .form-select {
  width: 100%;
  font-size: $font-size-base;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: $color-surface;
  color: $color-text-primary;
  backdrop-filter: blur($blur-sm);
  font-family: $font-family-base;
  transition: $transition-normal;
  
  &::placeholder {
    color: $color-text-muted;
  }
  
  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: $color-surface-hover;
  }
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right $space-3 center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  padding-right: $space-10;
}

.modal-footer {
  display: flex;
  gap: $space-3;
  justify-content: flex-end;
  padding: $space-6;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid $color-border;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  border-radius: $radius-lg;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: $font-weight-semibold;
  font-size: $font-size-sm;
  font-family: $font-family-base;
  transition: $transition-normal;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: $transition-normal;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    
    &:hover::before {
      left: -100%;
    }
  }
  
  .material-symbols-outlined {
    font-size: 18px;
  }
  
  &--primary {
    background: $gradient-primary;
    color: $color-text-primary;
    box-shadow: $shadow-md, $shadow-glow;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: $shadow-lg, $shadow-glow;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
  
  &--secondary {
    background: $color-surface;
    color: $color-text-secondary;
    border: 1px solid $color-border;
    backdrop-filter: blur($blur-sm);
    
    &:hover:not(:disabled) {
      background: $color-surface-hover;
      color: $color-text-primary;
      border-color: $color-primary;
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
