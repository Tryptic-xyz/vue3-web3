import { watchEffect, ref, reactive, toRefs, computed } from 'vue'
import { defineStore } from 'pinia'

import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { useENS } from '@/composables/useENS'

interface Wallet {
  address: string | null
  ensName?: string | null
}

export const useWalletStore = defineStore('wallet', () => {
  const { onProviderConnected, getProviders } = useWeb3ProviderStore()
  const { lookupAddress } = useENS()

  const wallet: Wallet = reactive({ address: null, ensName: null })
  const listeningToEvents = ref(false)
  const error = ref('')

  function listenToEvents() {
    if (listeningToEvents.value) {
      return
    }

    window.ethereum.on('accountsChanged', async (accts: Array<string>) => {
      if (accts.length) {
        setAccount(accts[0])
      } else {
        setAccount(null)
      }
    })

    window.ethereum.on('disconnected', () => {
      console.log('disconnected')
      setAccount(null)
    })

    listeningToEvents.value = true
  }

  function setAccount(address: string | null) {
    wallet.address = address ? address.toLocaleLowerCase() : address
  }

  async function initWallet() {
    const { browserProvider } = getProviders()
    const accts = await browserProvider?.listAccounts()

    if (accts?.length) {
      setAccount(accts[0].address)
    }

    listenToEvents()
  }

  async function connect() {
    if (!wallet.address) {
      try {
        const accts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })

        console.log(accts, 'connect')

        setAccount(accts[0])
        error.value = ''
      } catch (err: any) {
        error.value = err.message
        console.log(err)
      }
    }
  }

  const prettyAddress = computed(() => {
    if (wallet.address) {
      const t = wallet.address.split('')
      const prefix = t.slice(0, 6).join('')
      const suffix = t.slice(t.length - 4, t.length).join('')
      return prefix + '...' + suffix
    } else {
      return ''
    }
  })

  const getSigner = async () => {
    if (wallet.address) {
      const { browserProvider } = getProviders()
      return await browserProvider?.getSigner()
    }
  }

  watchEffect(async () => {
    if (wallet.address) {
      wallet.ensName = await lookupAddress(wallet.address)
    }
  })

  onProviderConnected(() => {
    initWallet()
  })

  return { connect, error, ...toRefs(wallet), prettyAddress, getSigner }
})
