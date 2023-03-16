<script setup lang="ts">
import { useWeb3Provider } from '@/composables/useWeb3Provider'
const { onProviderAvailable, getProviders, error, pending } = useWeb3Provider()

onProviderAvailable(() => {
  const { browserProvider } = getProviders()
})
</script>

<template>
  <div class="flex">
    {{ !pending && error ? error : 'connected.' }}
  </div>
</template>
