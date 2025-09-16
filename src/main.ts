import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(TDesign)
app.use(router)

app.mount('#app')