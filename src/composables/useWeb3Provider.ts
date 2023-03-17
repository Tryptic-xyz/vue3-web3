import detectProvider from '@metamask/detect-provider'
import { useWatchBoolean } from './useWatchBoolean'
import type { Ref } from 'vue'
import { ref, reactive } from 'vue'
import { ethers } from 'ethers'
import type { BrowserProvider, AlchemyProvider } from 'ethers/types'

export function useWeb3Provider() {
  const {
    onTrue: onProviderConnected,
    toggle: toggleProviderConnected,
    ref: connected
  } = useWatchBoolean(false)

  const pending = ref(true)
  const error = ref('')

  const browserProvider: BrowserProvider | null = null
  const alchemyProvider: AlchemyProvider | null = null

  const init = async () => {
    const provider = await detectProvider()

    // if (provider) {
    //   browserProvider = new ethers.BrowserProvider(window.ethereum)
    //   alchemyProvider = new ethers.AlchemyProvider()
    //   // await browserProvider.send('eth_requestAccounts', [])

    //   toggleProviderConnected()
    // } else {
    //   error.value = 'Please visit this website from a web3 enabled browser.'
    // }

    pending.value = false
  }

  function getProviders() {
    return {
      alchemyProvider,
      browserProvider
    }
  }

  // init()

  return { onProviderConnected, getProviders, error, pending, connected }
}
