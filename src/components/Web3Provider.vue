<script setup lang="ts">
import { useWeb3ProviderStore } from '@/stores/web3Provider'

const store = useWeb3ProviderStore()
</script>

<template>
  <slot v-if="store.connected" name="connected" />
  <slot :error="store.error" v-if="store.error" name="disconnected">
    {{ store.error }}
  </slot>
</template>

<style lang="scss" scoped></style>
