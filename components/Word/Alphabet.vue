<template>
  <div
    :class="{
      'text-xl': !small,
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  small?: boolean;
}>();
</script>
