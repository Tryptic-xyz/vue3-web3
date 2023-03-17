import detectProvider from '@metamask/detect-provider'
import { useBooleanWatcher } from './useBooleanWatcher'
import type { Ref } from 'vue'
import { ref, reactive } from 'vue'
import { ethers } from 'ethers'
import type { BrowserProvider, AlchemyProvider } from 'ethers/types'

let browserProvider: BrowserProvider | null = null
let alchemyProvider: AlchemyProvider | null = null
const pending = ref(true)
const error = ref('')

export function useWeb3Provider() {
  const { onTrue: onProviderAvailable, toggle: toggleProviderAvailable } = useBooleanWatcher(false)

  const init = async () => {
    const provider = await detectProvider()
    console.log('init')

    if (provider) {
      browserProvider = new ethers.BrowserProvider(window.ethereum)
      alchemyProvider = new ethers.AlchemyProvider()
      await browserProvider.send('eth_requestAccounts', [])

      toggleProviderAvailable()
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

  return { onProviderAvailable, getProviders, error, pending }
}
