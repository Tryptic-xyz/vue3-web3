import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import App from './App.vue'
import initRouter from './router'

import { initializeApp } from 'firebase/app'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

import { useUserStore } from './stores/user'

import './assets/main.css'
import 'vue-toastification/dist/index.css'

const firebaseConfig = {
  apiKey: 'AIzaSyCUrID-x-1poykOan0NUuX1YdUnEE7YTnk',
  authDomain: 'web3-auth-fa7e8.firebaseapp.com',
  projectId: 'web3-auth-fa7e8',
  storageBucket: 'web3-auth-fa7e8.appspot.com',
  messagingSenderId: '686248080273',
  appId: '1:686248080273:web:c111f77c8d3630eadbe030'
}

initializeApp(firebaseConfig)
const auth = getAuth()

const options = {
  position: 'top-center',
  draggable: false,
  closeOnClick: false,
  timeout: 20000,
  toastClassName: 'vue3-web3'
}

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const router = initRouter()

app.use(router)
app.use(Toast, options)

// user has verified wallet
// use this for operations that
// require accessing the database
// any blockchain ops still go through MM
onAuthStateChanged(auth, (user) => {
  const { setUser } = useUserStore()
  if (user) {
    setUser(user)
  }
})

app.mount('#app')
