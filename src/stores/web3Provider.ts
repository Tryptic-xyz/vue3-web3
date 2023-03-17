import { ref, computed, reactive } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useWeb3Provider } from '@/composables/useWeb3Provider'
// const { onProviderAvailable, getProviders, error, pending } = useWeb3Provider()
import type { BrowserProvider, AlchemyProvider, Network } from 'ethers/types'

export const useWeb3ProviderStore = defineStore('provider', useWeb3Provider)
