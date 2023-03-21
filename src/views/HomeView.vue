<script setup lang="ts">
import Web3AccountDisplay from '@/components/Web3AccountDisplay.vue'
</script>

<template>
  <div
    class="relative isolate overflow-hidden bg-gray-900 w-full flex items-center justify-center"
    style="height: 100vh"
  >
    <div class="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Tryptic's Vue Web3 Starter Kit.<br />
        </h2>
        <div class="mt-6 flex items-center justify-center gap-x-6">
          <Web3AccountDisplay :showConnectBtn="true" />
        </div>
      </div>
    </div>
    <svg
      viewBox="0 0 1024 1024"
      class="absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
      aria-hidden="true"
    >
      <circle
        cx="512"
        cy="512"
        r="512"
        fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
        fill-opacity="0.7"
      />
      <defs>
        <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
          <stop stop-color="#7775D6" />
          <stop offset="1" stop-color="#E935C1" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>
