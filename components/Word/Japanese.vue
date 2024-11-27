<template>
  <div class="text-cool-500 leading-none text-nowrap">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  small?: boolean;
}>();
</script>
