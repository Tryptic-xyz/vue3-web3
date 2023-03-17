<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'
import Web3ConnectWalletBtn from './Web3ConnectWalletBtn.vue'

defineProps({ showConnectBtn: { type: Boolean, default: false } })

const wallet = useWalletStore()
</script>

<template>
  <div>
    <div v-if="wallet.address && !wallet.ensName">{{ wallet.prettyAddress }}</div>
    <div v-if="wallet.ensName">{{ wallet.ensName }}</div>
    <Web3ConnectWalletBtn v-if="!wallet.address && showConnectBtn" />
  </div>
</template>

<style scoped></style>
