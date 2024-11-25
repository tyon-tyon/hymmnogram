<template>
  <div
    v-if="!small"
    class="text-2xl"
    :class="{
      'font-hymmnos': hymmnos,
      'font-arciela': arciela,
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  small?: boolean;
  hymmnos?: boolean;
  arciela?: boolean;
}>();
</script>
