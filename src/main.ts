//TODO mayve inject the provider into app here
// have it available app wide?
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import './assets/main.css'
import 'vue-toastification/dist/index.css'

const options = {
  position: 'top-center',
  draggable: false,
  closeOnClick: false,
  timeout: 20000,
  toastClassName: 'vue3-web3'
}

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast, options)

app.mount('#app')
