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
      <nuxt-link href="/editor" class="text-sm text-primary-600 text-sm"
        >エディタ</nuxt-link
      >
    </UContainer>
  </div>
  <UContainer class="container">
    <slot></slot>
  </UContainer>
</template>

<script setup lang="ts"></script>

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
  font-size: 15vw;
  transform: translateY(-50%);
  top: 50%;
  left: -2vw;
  mix-blend-mode: multiply;
}
</style>
