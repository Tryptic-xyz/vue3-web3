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

  const getNetwork = () => {
    const chainId = window.ethereum.networkVersion
    const { name, apiKeys, etherscanURL } = networkMap[chainId]

    network.chainId = chainId
    network.name = name
    network.etherscanURL = etherscanURL
    network.apiKey = apiKeys.alchemy

    return { ...networkMap[chainId] }
  }

  listenForNetworkChanges()

  return { getNetwork, network }
}
