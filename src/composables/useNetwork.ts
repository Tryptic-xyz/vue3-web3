import { reactive } from 'vue'

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

export const networkMap: NetworkMap = {
  '0x1': {
    name: 'homestead',
    apiKeys: { alchemy: 'D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4' },
    etherscanURL: 'https://etherscan.io/tx/'
  },
  '0x5': {
    name: 'goerli',
    apiKeys: { alchemy: '_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi' },
    etherscanURL: 'https://goerli.etherscan.io/tx/'
  }
}

const network: Network = reactive({
  chainId: null,
  name: null,
  apiKey: null,
  etherscanURL: null
})

export const useNetwork = () => {
  const listenForNetworkChanges = () => {
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
  }

  const getNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })

      const { name, apiKeys, etherscanURL } = networkMap[chainId]

      network.chainId = chainId
      network.name = name
      network.etherscanURL = etherscanURL
      network.apiKey = apiKeys.alchemy

      return { ...networkMap[chainId] }
    }
  }

  if (window.ethereum) {
    listenForNetworkChanges()
  }

  return { getNetwork, network }
}
