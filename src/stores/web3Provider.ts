import { defineStore, acceptHMRUpdate } from 'pinia'
import {useWeb3Provider} from '@/composables/useWeb3Provider'

export const useWeb3ProviderStore = defineStore('provider', useWeb3Provider)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWeb3ProviderStore, import.meta.hot))
}
