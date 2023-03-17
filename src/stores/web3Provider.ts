import { defineStore, acceptHMRUpdate } from 'pinia'
import detectProvider from '@metamask/detect-provider'
import { useWatchBoolean } from '@/composables/useWatchBoolean'
import type { Ref } from 'vue'
import { ref, reactive } from 'vue'
import { ethers } from 'ethers'
import type { BrowserProvider, AlchemyProvider } from 'ethers/types'
import { useNetwork } from '@/composables/useNetwork'

export const useWeb3ProviderStore = defineStore('provider', () => {
  const { getNetwork } = useNetwork()

  const {
    onTrue: onProviderConnected,
    toggle: toggleProviderConnected,
    ref: connected
  } = useWatchBoolean(false)

  const pending = ref(true)
  const error = ref('')

  let browserProvider: BrowserProvider | null = null
  let alchemyProvider: AlchemyProvider | null = null

  const init = async () => {
    const provider = await detectProvider()
    const networkDetail = getNetwork()

    if (provider) {
      browserProvider = new ethers.BrowserProvider(window.ethereum)

      alchemyProvider = new ethers.AlchemyProvider(
        networkDetail.name,
        networkDetail.apiKeys.alchemy
      )

      toggleProviderConnected()
    } else {
      error.value = 'Please visit this website from a web3 enabled browser.'
    }

    pending.value = false
  }

  function getProviders() {
    return {
      alchemyProvider,
      browserProvider
    }
  }

  init()

  return { onProviderConnected, getProviders, error, pending, connected }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWeb3ProviderStore, import.meta.hot))
}
