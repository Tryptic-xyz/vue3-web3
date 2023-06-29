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
  1: {
    name: 'homestead',
    apiKeys: { alchemy: import.meta.env.VITE_ALCHEMY_API_KEY_HOMESTEAD },
    etherscanURL: 'https://etherscan.io/tx/'
  },
  5: {
    name: 'goerli',
    apiKeys: { alchemy: import.meta.env.VITE_ALCHEMY_API_KEY_GOERLI },
    etherscanURL: 'https://goerli.etherscan.io/tx/'
  },
  11155111: {
    name: 'sepolia',
    apiKeys: { alchemy: import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA },
    etherscanURL: 'https://sepolia.etherscan.io/tx/'
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
      const chainId = window.ethereum.networkVersion

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
