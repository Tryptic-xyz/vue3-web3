import detectProvider from '@metamask/detect-provider'
import { ref } from 'vue'
import { ethers } from 'ethers'
import type { BrowserProvider, AlchemyProvider } from 'ethers/types'

import { useToggleEvents } from '@/composables/useToggleEvents'
import { useNetwork } from '@/composables/useNetwork'

export function useWeb3Provider() {
  const [onProviderConnected, ,toggleProviderConnected, connected] = useToggleEvents()

  // const {
  //   onTrue: onProviderConnected,
  //   toggle: toggleProviderConnected,
  //   ref: connected
  // } = useToggleEvents(false)

  const pending = ref(true)
  const error = ref('')

  let browserProvider: BrowserProvider | null = null
  let alchemyProvider: AlchemyProvider | null = null

  const init = async () => {
    const provider = await detectProvider()

    if (provider) {
      const { getNetwork } = useNetwork()
      const networkDetail = await getNetwork()

      browserProvider = new ethers.BrowserProvider(window.ethereum)
      alchemyProvider = new ethers.AlchemyProvider(
        networkDetail?.name,
        networkDetail?.apiKeys.alchemy
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

  return {
    onProviderConnected,
    getProviders,
    error,
    pending,
    connected
  }
}
