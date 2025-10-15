import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import translationMixin from './mixins/translation.js'
import './styles/main.scss'

const app = createApp(App)

app.mixin(translationMixin)

app.use(router)
app.use(store)
app.mount('#app')
