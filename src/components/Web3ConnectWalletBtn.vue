<script setup lang="ts">
import Web3Provider from './Web3Provider.vue'
import { useWalletStore } from '@/stores/wallet'
const wallet = useWalletStore()
</script>

<template>
  <Web3Provider>
    <template #connected>
      <button @click="() => wallet.connect()">connect</button>
    </template>
    <template #disconnected>
      <div>web3 not enabled!</div>
    </template>
  </Web3Provider>
</template>

<style scoped></style>
