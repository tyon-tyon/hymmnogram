<template>
  <div class="header-nav py-2">
    <span class="bg-logo font-hymmnos text-primary-100 absolute z--1"
      >HYMMNOGRAM</span
    >
    <UContainer class="relative flex items-center justify-between">
      <nuxt-link class="logo" to="/">
        <div class="text-primary-600 text-2xl font-bold">HYMMNOGRAM</div>
        <div class="text-cool-600 text-sm japanese">ヒュムノグラム</div>
      </nuxt-link>
      <UButton label="Menu" @click="openDrawer = true" variant="ghost" />
      <USlideover
        v-model="openDrawer"
        :ui="{
          width: 'max-w-64',
        }"
      >
        <NavMenu />
      </USlideover>
    </UContainer>
  </div>
  <UContainer class="container">
    <slot></slot>
  </UContainer>
</template>

<script setup lang="ts">
const openDrawer = ref(false);
</script>

<style scoped>
.header-nav {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #e2e8f0;
  min-height: 10px;
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
}
.container {
  margin-top: 70px;
}
.logo > * {
  line-height: 1;
}
.bg-logo {
  color: transparent;
  text-shadow: 0 0 4px rgb(var(--color-primary-400));
  opacity: 0.25;
  font-size: 15vw;
  transform: translateY(-50%);
  top: 50%;
  left: -2vw;
  mix-blend-mode: multiply;
}
</style>
