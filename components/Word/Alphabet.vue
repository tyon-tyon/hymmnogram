<template>
  <div
    :class="{
      'text-xl': !small,
    }"
    class="leading-none mb-2"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  small?: boolean;
}>();
</script>
