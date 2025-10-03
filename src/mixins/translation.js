export default {
  computed: {
    $translations() {
      return this.$store.getters.currentTranslations
    }
  },
  methods: {
    $t(key, fallback = key) {
      const keys = key.split('.')
      let value = this.$translations
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          return fallback
        }
      }
      
      return typeof value === 'string' ? value : fallback
    }
  }
}