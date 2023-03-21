<script setup lang="ts">
import Web3Provider from './Web3Provider.vue'
import MetamaskIcon from './IconMetamask.vue'

import { useWalletStore } from '@/stores/wallet'
const wallet = useWalletStore()
</script>

<template>
  <Web3Provider>
    <template #connected>
      <div class="relative flex group">
        <div
          class="group-hover:bg-slate-600/50 transition-colors group-hover:text-white relative flex justify-center cursor-pointer items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          @click="() => wallet.connect()"
        >
          <MetamaskIcon
            class="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform transform-gpu will-change-transform ease-in-out"
          />
          <div
            class="group-hover:translate-x-1 transition-transform transform-gpu will-change-transform ease-in-out"
          >
            Connect Your Wallet
          </div>
        </div>
      </div>
    </template>
  </Web3Provider>
</template>

<style scoped></style>
