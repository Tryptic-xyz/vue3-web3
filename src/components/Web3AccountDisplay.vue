<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import Web3ConnectWalletBtn from './Web3ConnectWalletBtn.vue'

defineProps({ showConnectBtn: { type: Boolean, default: false } })

const wallet = useWalletStore()
</script>

<template>
  <div class="text-white">
    <div
      class="inline-flex items-center px-2 py-1 leading-none text-center text-white bg-black border border-white"
    >
      <div class="w-2 h-2 bg-green-300 rounded-full"></div>
      <div class="ml-2 font-mono text-sm text-white">
        {{ wallet.ensName || wallet.prettyAddress }}
      </div>
    </div>
    <Web3ConnectWalletBtn v-if="!wallet.address && showConnectBtn" />
  </div>
</template>

<style scoped></style>
