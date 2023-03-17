<script setup lang="ts">
import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'
const { getProviders, onProviderAvailable } = useWeb3ProviderStore()
const store = useNetworkStore()
const { chainId, apiKey, name, etherscanURL } = storeToRefs(store)

onProviderAvailable(async () => {
  console.log(chainId, name)
})
</script>

<template>
  <div class="flex">{{ chainId }} {{ name }}</div>
</template>
