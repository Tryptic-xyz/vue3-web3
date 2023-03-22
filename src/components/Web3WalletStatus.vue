<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet'

const wallet = useWalletStore()
</script>

<template>
  <div v-if="wallet.address && wallet.init">
    <slot
      :address="wallet.address"
      :prettyAddress="wallet.prettyAddress"
      :onAccountConnected="wallet.onConnected"
      :getSigner="wallet.getSigner"
      name="connected"
    />
  </div>
  <div v-if="wallet.init && !wallet.address">
    <slot name="disconnected" />
  </div>
</template>
