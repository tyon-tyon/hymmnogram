<template>
  <UButton
    :ui="{ rounded: 'rounded-none' }"
    class="flex-col justify-around flex p-1 aspect-1"
    :color="color"
    :variant="variant"
  >
    <slot></slot>
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  color: "primary" | "white";
  variant?: "link" | "solid" | "outline" | "soft" | "ghost";
}>();
</script>
