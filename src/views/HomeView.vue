<script setup lang="ts">
import Web3Provider from '@/components/Web3Provider.vue'
import { useWalletStore } from '@/stores/wallet'
import { useNetwork } from '@/composables/useNetwork'

const { chainId, apiKey, name, etherscanURL } = useNetwork()

const walletStore = useWalletStore()
</script>

<template>
  <Web3Provider>
    <template #connected>
      <div class="flex">{{ chainId }} {{ name }}</div>
      <button v-if="!walletStore.address" @click="() => walletStore.connect()">connect</button>
    </template>
  </Web3Provider>
</template>
