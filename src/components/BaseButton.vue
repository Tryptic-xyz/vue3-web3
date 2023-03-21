<script setup lang="ts">
import IconSpinningIndicator from './IconSpinningIndicator.vue'
defineProps({
  loading: {
    default: false,
    type: Boolean
  },
  disabled: {
    default: false,
    type: Boolean
  },
  msg: String,
  btnText: String
})
</script>
<template>
  <button
    type="button"
    class="hover:bg-slate-600/50 transition-all hover:text-white relative flex justify-center cursor-pointer items-center rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    :class="{
      'pointer-events-none': loading,
      'opacity-20': loading || disabled,
      'cursor-not-allowed': loading || disabled,
      'hover:bg-white': loading || disabled,
      'hover:text-gray-900': loading || disabled
    }"
    :disabled="disabled"
  >
    <div class="absolute -bottom-6 text-white">{{ msg }}</div>
    <div :class="{ 'opacity-0': loading }">
      <slot>
        {{ btnText }}
      </slot>
    </div>
    <IconSpinningIndicator
      class="absolute -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 fill-black"
      v-if="loading"
    />
  </button>
</template>

<style scoped></style>
