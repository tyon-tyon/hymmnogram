<template>
  <NuxtLink :to="href" :target="target" :rel="rel" class="text-blue-500 hover:text-blue-700 underline dark:hover:text-blue-400">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  target?: string;
  rel?: string;
}>();
</script>