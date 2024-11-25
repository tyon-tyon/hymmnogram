<template>
  <div
    class="text-cool-500 leading-none text-nowrap"
    :class="{
      'text-sm': !small,
      'text-2xs': small,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  small: {
    type: Boolean,
    default: false,
  },
});
</script>
