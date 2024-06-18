<template>
  <UButton
    :ui="{ rounded: 'rounded-none' }"
    class="flex-col justify-around flex p-1"
    :color="color"
    :variant="variant"
  >
    <slot></slot>
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
  variant?: string;
}>();

</script>

