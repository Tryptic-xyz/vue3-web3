import { defineStore } from 'pinia'
import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { useENS } from '@/composables/useENS'
import { watchEffect, ref, reactive, toRefs, computed } from 'vue'

interface Wallet {
  address: string | null
  ensAddress?: string | null
}

export const useWalletStore = defineStore('wallet', () => {
  const { onProviderConnected, getProviders } = useWeb3ProviderStore()
  const { lookupAddress } = useENS()

  const wallet: Wallet = reactive({ address: null, ensAddress: null })
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
    console.log(accts, 'init wallet')

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

  onProviderConnected(() => {
    initWallet()
  })

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

  watchEffect(async () => {
    if (wallet.address) {
      wallet.ensAddress = await lookupAddress(wallet.address)
    }
  })

  return { connect, error, ...toRefs(wallet), prettyAddress }
})
