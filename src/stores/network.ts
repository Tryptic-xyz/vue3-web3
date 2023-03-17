import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useWeb3ProviderStore } from './web3Provider'

interface Network {
  chainId?: string | null
  name?: string | null
  apiKey?: string | null
  etherscanURL?: string | null
}

interface NetworkDetail {
  name: string
  apiKeys: { [key: string]: string }
  etherscanURL: string
}

interface NetworkMap {
  [key: string]: NetworkDetail
}

const networkMap: NetworkMap = {
  '1': {
    name: 'homestead',
    apiKeys: { alchemy: 'D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4' },
    etherscanURL: 'https://etherscan.io/tx/'
  },
  '5': {
    name: 'goerli',
    apiKeys: { alchemy: '_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi' },
    etherscanURL: 'https://goerli.etherscan.io/tx/'
  }
}

export const useNetworkStore = defineStore('network', () => {
  const { getProviders, onProviderAvailable } = useWeb3ProviderStore()

  const network: Network = reactive({
    chainId: null,
    name: null,
    apiKey: null,
    etherscanURL: null
  })

  const listenForNetworkChanges = () => {
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
  }

  onProviderAvailable(async () => {
    const { browserProvider } = getProviders()
    const n = await browserProvider?.getNetwork()
    network.chainId = n?.chainId.toString()
    network.name = n?.name

    if (network.chainId) {
      const netDetail = networkMap[network?.chainId]
      network.apiKey = netDetail.apiKeys.alchemy
      network.etherscanURL = netDetail.etherscanURL
    }

    listenForNetworkChanges()
  })

  return { ...toRefs(network) }
})
