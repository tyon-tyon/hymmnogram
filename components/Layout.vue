<template>
  <div class="fixed top-0 left-0 right-0 z-10 min-h-[10px] overflow-hidden border-b border-gray-200 bg-white/90">
    <span class="absolute -z-10 left-[-2vw] top-1/2 -translate-y-1/2 text-[15vw] text-transparent opacity-25 mix-blend-multiply font-hymmnos text-primary-100 [text-shadow:0_0_4px_rgb(var(--color-primary-400))]">HYMMNOGRAM</span>
    <UContainer class="relative flex items-center justify-between py-2">
      <nuxt-link class="flex flex-col leading-none" to="/">
        <div class="text-2xl font-bold text-primary-600 leading-none">HYMMNOGRAM</div>
        <div class="text-sm text-cool-600 japanese leading-none">ヒュムノグラム</div>
      </nuxt-link>
      <UButton label="Menu" @click="openDrawer = true" variant="ghost" />
      <USlideover v-model="openDrawer" :ui="{
        width: 'max-w-64',
      }">
        <NavMenu />
      </USlideover>
    </UContainer>
  </div>
  <UContainer class="mt-[55px]">
    <UBreadcrumb v-if="breadcrumbLinks.length > 0" :links="[{ label: 'ホーム', to: '/' }, ...breadcrumbLinks]" class="pt-2" />
    <div class="pt-4">
      <slot></slot>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const openDrawer = ref(false);
const props = defineProps<{
  breadcrumbLinks: {
    label: string;
    to: string;
  }[];
}>();
</script>

<style scoped>
.logo>* {
  line-height: 1;
}
</style>
