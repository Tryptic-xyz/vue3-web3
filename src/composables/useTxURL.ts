import { useNetwork } from '@/composables/useNetwork'

export function useTxURL(txHash: string) {
  const { network } = useNetwork()

  return `${network.etherscanURL}${txHash}`
}
