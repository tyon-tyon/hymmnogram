<template>
  <div class="header-nav p-1 bg-white/90 dark:bg-black/90">
    <LineTranslation />
  </div>
</template>

<script setup lang="ts">
import LineTranslation from "./LineTranslation.vue";
</script>

<style>
.header-nav {
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #e2e8f0;
  min-height: 10px;
}
</style>
