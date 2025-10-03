<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-icon">
          <span class="material-symbols-outlined">delete</span>
        </div>
        <h2 class="modal-title">Varlık Sil</h2>
        <p class="modal-subtitle">
          <strong>{{ priceLabel(item.type) }}</strong> için kaç adet/gram silmek istiyorsunuz?
        </p>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">scale</span>
            Silinecek Miktar
          </label>
          <input 
            type="number" 
            v-model.number="deleteAmount" 
            :min="1" 
            :max="maxAmount" 
            class="form-input"
            placeholder="Miktar girin"
          />
          <div class="form-helper">Maksimum: {{ maxAmount }} {{ getUnitText() }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span class="material-symbols-outlined">description</span>
            Açıklama (Opsiyonel)
          </label>
          <input 
            v-model="deleteDescription" 
            class="form-input"
            placeholder="Silme sebebini açıklayabilirsiniz..."
          />
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn--secondary">
          <span class="material-symbols-outlined">close</span>
          İptal
        </button>
        <button @click="confirmDelete" class="btn btn--danger" :disabled="!canDelete">
          <span class="material-symbols-outlined">delete</span>
          Sil
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
    canDelete() {
      return this.deleteAmount >= 1 && this.deleteAmount <= this.maxAmount
    }
  },
  methods: {
    priceLabel,
    getUnitText() {
      if (!this.item || !this.item.type) return ''
      if (this.item.type === 'usd' || this.item.type === 'eur') return 'adet'
      if (this.item.type === '24_ayar' || this.item.type === '22_ayar' || this.item.type === 'gumus') return 'gram'
      if (this.item.type === 'ceyrek' || this.item.type === 'tam') return 'adet'
      return this.item.unit || 'adet'
    },
    confirmDelete() {
      if (!this.canDelete) return
      this.$emit('confirm', { amount: this.deleteAmount, description: this.deleteDescription })
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
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-bottom: 1px solid $color-border;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto $space-4 auto;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-lg, 0 0 20px rgba(239, 68, 68, 0.3);
  
  .material-symbols-outlined {
    font-size: 32px;
    color: white;
  }
}

.modal-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $space-2;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
  margin-bottom: $space-6;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  margin-bottom: $space-3;
  
  .material-symbols-outlined {
    font-size: 18px;
    color: $color-text-secondary;
  }
}

.form-input {
  width: 100%;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: $color-bg-primary;
  color: $color-text-primary;
  font-size: $font-size-base;
  transition: $transition-fast;
  
  &:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  &::placeholder {
    color: $color-text-tertiary;
  }
  
  &[type="number"] {
    text-align: center;
    font-weight: $font-weight-semibold;
    font-size: $font-size-lg;
  }
}

.form-helper {
  font-size: $font-size-xs;
  color: $color-text-tertiary;
  margin-top: $space-2;
  text-align: center;
}

.modal-footer {
  padding: $space-6;
  border-top: 1px solid $color-border;
  display: flex;
  gap: $space-3;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: $transition-fast;
  border: none;
  white-space: nowrap;
  
  .material-symbols-outlined {
    font-size: 18px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &--secondary {
    background: $color-bg-tertiary;
    color: $color-text-secondary;
    border: 1px solid $color-border;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: $color-text-primary;
    }
  }
  
  &--danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: $shadow-md, 0 0 20px rgba(239, 68, 68, 0.2);
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: $shadow-lg, 0 0 25px rgba(239, 68, 68, 0.3);
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .modal {
    min-width: auto;
    width: 90vw;
    margin: $space-4;
  }
  
  .modal-footer {
    flex-direction: column;
    
    .btn {
      justify-content: center;
    }
  }
}
</style>
