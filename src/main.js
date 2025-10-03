import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import translationMixin from './mixins/translation.js'
import { useToast } from './composables/useToast.js'
import './styles/main.scss'

const app = createApp(App)

app.mixin(translationMixin)
app.config.globalProperties.$toast = useToast().showToast

app.use(router)
app.use(store)
app.mount('#app')
