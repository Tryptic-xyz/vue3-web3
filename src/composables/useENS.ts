import { useWeb3ProviderStore } from '@/stores/web3Provider'

export function useENS() {
  const { getProviders } = useWeb3ProviderStore()

  const lookupAddress = async (address: string) => {
    const { alchemyProvider } = getProviders()

    return await alchemyProvider?.lookupAddress(address)
  }

  return { lookupAddress }
}
