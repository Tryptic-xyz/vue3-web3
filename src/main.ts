//TODO mayve inject the provider into app here
// have it available app wide?
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

app.use(router)

app.mount('#app')
