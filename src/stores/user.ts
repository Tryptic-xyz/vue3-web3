import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { getAuth, signInWithCustomToken, signOut, type User } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { useWatchBoolean } from '@/composables/useWatchBoolean'
import { useWalletStore } from '@/stores/wallet'

export const useUserStore = defineStore('user', () => {
  const functions = getFunctions()
  const getNonce = httpsCallable(functions, 'retrieveNonce')
  const verifySignature = httpsCallable(functions, 'verifySignedMessage')
  const isAuthenticating = ref(false)

  const {
    onTrue: onUserLoggedIn,
    onFalse: onUserLoggedOut,
    toggle: toggleUserLoggedInStatus
  } = useWatchBoolean(false)

  const user = reactive({
    id: '',
    displayName: ''
  })

  async function login() {
    isAuthenticating.value = true
    const { getProviders } = useWeb3ProviderStore()
    const { browserProvider } = getProviders()
    const wallet = useWalletStore()
    const auth = getAuth()

    const res: any = await getNonce({ address: wallet.address })
    const signer = await browserProvider?.getSigner()

    const signature = await signer?.signMessage(res.data.nonce)

    const {
      data: { token }
    } = await verifySignature({ address: wallet.address, signature })

    await signInWithCustomToken(auth, token)
    toggleUserLoggedInStatus()

    isAuthenticating.value = true
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

  return { login, logout, user, setUser, onUserLoggedIn, onUserLoggedOut, isAuthenticating }
})
