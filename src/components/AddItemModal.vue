<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <h3>Varlık Ekle</h3>
      <label>Tür
        <select v-model="addType">
          <option disabled value="">Seçiniz</option>
          <option v-for="(label, key) in assetTypes" :key="key" :value="key">{{ label }}</option>
        </select>
      </label>
      <label v-if="showUnitInput">Birim
        <input v-model="addUnit" placeholder="Birim (gr, adet vb.)" />
      </label>
      <label>Miktar
        <input type="number" v-model.number="addAmount" min="1" />
      </label>
      <label>Açıklama (opsiyonel)
        <input v-model="addDescription" placeholder="Açıklama yazabilirsiniz" />
      </label>
      <div class="modal-actions">
        <button @click="confirmAdd" class="modal-confirm">Ekle</button>
        <button @click="$emit('close')" class="modal-cancel">İptal</button>
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
      // Sadece bazı türler için birim sorulsun (ör: altınlar için 'gram', diğerleri için otomatik)
      return false // Gerekirse true yapabilirsin
    }
  },
  methods: {
    confirmAdd() {
      if (!this.addType || this.addAmount < 1) return
      this.$emit('add', {
        type: this.addType,
        unit: this.addUnit || this.defaultUnitForType(this.addType),
        amount: this.addAmount,
        description: this.addDescription
      })
    },
    defaultUnitForType(type) {
      if (type === 'usd' || type === 'eur') return 'adet'
      if (type === '24_ayar' || type === '22_ayar' || type === 'gumus') return 'gr'
      if (type === 'ceyrek' || type === 'tam') return 'adet'
      return ''
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
.modal label {
  display: block;
  margin: 1rem 0 0.5rem 0;
  font-weight: 500;
  text-align: left;
}
.modal input, .modal select {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.modal-confirm {
  background: #17cf17;
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
