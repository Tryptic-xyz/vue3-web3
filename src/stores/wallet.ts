import { defineStore } from 'pinia'
import { useWallet } from '@/composables/useWallet'


export const useWalletStore = defineStore('wallet', useWallet)

