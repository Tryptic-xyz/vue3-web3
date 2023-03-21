<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps({
  max: {
    type: Number,
    default: 99
  },
  disabled: {
    type: Boolean,
    default: false
  },
  startAt: {
    type: Number,
    default: 0
  },
  label: String,
  canIncrement: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['change'])

const count = ref(props.startAt)

watchEffect(() => {
  count.value = props.startAt
})

const inc = () => {
  if (count.value < props.max && props.canIncrement) {
    count.value = count.value + 1
    emit('change', count.value)
  }
}

const dec = () => {
  if (count.value - 1 > 0) {
    count.value = count.value - 1
    emit('change', count.value)
  }
}
</script>
<template>
  <div
    class="inline-flex flex-col items-center justify-center space-y-2"
    :class="{
      'opacity-20': disabled,
      'cursor-not-allowed': disabled
    }"
  >
    <slot name="label">
      {{ label }}
    </slot>
    <div
      class="relative flex flex-row h-[45px]"
      :class="{
        'pointer-events-none': disabled
      }"
    >
      <button @click="dec" class="px-4 outline-none cursor-pointer">
        <span class="block m-auto text-3xl font-normal text-white">−</span>
      </button>
      <input
        type="number"
        v-model="count"
        :min="startAt"
        :max="max"
        class="inline-flex items-center px-1 text-3xl font-bold text-center text-black outline-none cursor-default pointer-events-none -tracking-wide focus:outline-none"
        name="custom-number-input"
      />
      <button @click="inc" class="px-4 outline-none cursor-pointer">
        <span class="text-3xl font-normal text-white">+</span>
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
