<template>
  <div class="header-nav p-1">
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
  background: rgba(255, 255, 255, 0.9);
}
</style>
