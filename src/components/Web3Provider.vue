<script setup lang="ts">
import { useWeb3ProviderStore } from '@/stores/web3Provider'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import IconSpinningIndicator from './IconSpinningIndicator.vue'

const provider = useWeb3ProviderStore()
defineProps({
  errorMsg: { default: 'Visit this site on a web3 enabled browser to continue!' },
  showErrorMsg: { default: true, type: Boolean },
  showLoadingIndicator: { default: true, type: Boolean }
})
</script>

<template>
  <IconSpinningIndicator class="fill-white" v-if="provider.pending && showLoadingIndicator" />
  <slot v-if="provider.connected" name="connected" />
  <slot
    :error="provider.error"
    v-if="provider.error && !provider.pending && showErrorMsg"
    name="disconnected"
  >
    <div class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ errorMsg }}
          </h3>
        </div>
      </div>
    </div>
  </slot>
</template>
