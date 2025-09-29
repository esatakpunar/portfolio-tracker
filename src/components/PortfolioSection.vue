<template>
  <div>
    <!-- Total -->
    <div class="total-section">
      <p class="total-label">Total Value</p>
      <p class="total-value">{{ totalFormatted }}</p>
    </div>
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="$emit('update:selected', tab)"
        :class="['tab', selected === tab ? 'tab-active' : '']"
      >
        {{ tab }}
      </button>
    </div>
    <!-- Asset List -->
    <div class="asset-list">
      <div
        v-for="(it,i) in itemsWithValue"
        :key="i"
        class="asset-card"
      >
        <div :class="['asset-icon', iconBgClass(it.type)]">
          <span class="material-symbols-outlined">{{ iconClass(it.type) }}</span>
        </div>
        <div class="asset-info">
          <p class="asset-name">{{ priceLabel(it.type) }}</p>
          <p class="asset-amount">{{ it.amount }} {{ it.unit }}</p>
        </div>
        <div class="asset-value">
          <p>{{ it.value }}</p>
        </div>
        <button class="delete-icon-btn" @click="openDeleteModal(it, i)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
    <!-- Delete Modal -->
    <DeleteItemModal
      :visible="showDeleteModal"
      :item="deleteTarget"
      :max-amount="deleteTarget.amount"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import DeleteItemModal from './DeleteItemModal.vue'
import { priceLabel } from '../store/index.js'
export default {
  components: { DeleteItemModal },
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
      deleteIndex: null
    }
  },
  methods: {
    priceLabel,
    iconClass(type) {
      const map = {
        '24_ayar': 'paid', // gold
        '22_ayar': 'paid', // gold
        'ceyrek': 'paid', // gold
        'tam': 'paid', // gold
        'usd': 'attach_money',
        'eur': 'euro',
        'gumus': 'circle'
      }
      return map[type] || 'help'
    },
    mdiClass(type) {
      const map = {
        '24_ayar': 'mdi-gold',
        '22_ayar': 'mdi-gold',
        'ceyrek': 'mdi-gold',
        'tam': 'mdi-gold',
        'usd': 'mdi-currency-usd',
        'eur': 'mdi-currency-eur',
        'gumus': 'mdi-silver'
      }
      return map[type] || 'mdi-help'
    },
    iconBgClass(type) {
      const map = {
        '24_ayar': 'icon-gold',
        '22_ayar': 'icon-gold',
        'ceyrek': 'icon-gold',
        'tam': 'icon-gold',
        'usd': 'icon-usd',
        'eur': 'icon-euro',
        'gumus': 'icon-silver'
      }
      return map[type] || 'icon-default'
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
