<template>
  <div
    v-if="!small"
    class="text-2xl"
    :class="{
      'font-hymmnos': hymmnos,
      'font-ar-ciela': arCiela,
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  small?: boolean;
  hymmnos?: boolean;
  arCiela?: boolean;
}>();
</script>
