import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { getAuth, signInWithCustomToken, signOut, type User } from 'firebase/auth'
import { useWatchBoolean } from '@/composables/useWatchBoolean'

export const useUserStore = defineStore('user', () => {
  const {
    onTrue: onUserLoggedIn,
    onFalse: onUserLoggedOut,
    toggle: toggleUserLoggedInStatus,
    ref: userLoggedIn
  } = useWatchBoolean(false)

  const user = reactive({
    id: '',
    displayName: ''
  })

  const login = async (token: string) => {
    const auth = getAuth()
    await signInWithCustomToken(auth, token)
    toggleUserLoggedInStatus()
  }

  const logout = async () => {
    const auth = getAuth()
    await signOut(auth)
    user.id = ''
    user.displayName = ''
    toggleUserLoggedInStatus()
  }

  const setUser = ({ uid, displayName = '' }: User) => {
    user.id = uid
    user.displayName = displayName || ''
  }

  onUserLoggedIn(() => {
    console.log('in@')
  })

  onUserLoggedOut(() => {
    console.log('out')
  })

  return { login, logout, user, setUser, onUserLoggedIn, onUserLoggedOut }
})
