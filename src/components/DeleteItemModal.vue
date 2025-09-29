<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <h3>Silinecek Miktar</h3>
      <p><b>{{ priceLabel(item.type) }}</b> için kaç adet/gr silmek istiyorsun?</p>
      <label>Açıklama (opsiyonel)
        <input v-model="deleteDescription" placeholder="Açıklama yazabilirsiniz" />
      </label>
      <input type="number" v-model.number="deleteAmount" :min="1" :max="maxAmount" />
      <div class="modal-actions">
        <button @click="confirmDelete" class="modal-confirm">Sil</button>
        <button @click="$emit('close')" class="modal-cancel">İptal</button>
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
  methods: {
    priceLabel,
    confirmDelete() {
      if (this.deleteAmount < 1 || this.deleteAmount > this.maxAmount) return
      this.$emit('confirm', { amount: this.deleteAmount, description: this.deleteDescription })
    }
  }
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  min-width: 260px;
  max-width: 90vw;
  text-align: center;
}
.modal input[type="number"] {
  width: 80px;
  font-size: 1.2rem;
  padding: 0.3rem 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.modal-confirm {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
.modal-cancel {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
</style>
