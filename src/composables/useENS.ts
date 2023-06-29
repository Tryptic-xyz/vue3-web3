import { useWeb3ProviderStore } from '@/stores/web3Provider'

export function useENS() {
  const { getProviders } = useWeb3ProviderStore()

  const lookupAddress = async (address: string) => {
    const { alchemyProvider } = getProviders()

    try {
      return await alchemyProvider?.lookupAddress(address)
    } catch (err) {
      console.log(err)
    }
  }

  return { lookupAddress }
}
