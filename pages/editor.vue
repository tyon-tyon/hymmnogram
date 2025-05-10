<template>
  <UContainer
    class="editor flex px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 flex-col md:flex-row absolute inset-0  bg-white/90 dark:bg-black/90">
    <div class="w-full flex-1 max-h-[100vh] overflow-y-auto flex flex-col">
      <HeaderNav />
      <UContainer class="flex-1 flex flex-col w-full py-2">
        <HymmnosTextArea class="flex-1 w-full" />
      </UContainer>
    </div>
    <div class="w-full md:w-[400px] md:border-l">
      <FooterNav />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import HymmnosTextArea from "~/components/EditorTools/HymmnosTextArea.vue";
import HeaderNav from "~/components/EditorTools/HeaderNav.vue";
import FooterNav from "~/components/EditorTools/FooterNav.vue";
useHead({
  title: 'ヒュムネエディタ',
  meta: [
    { name: "description", content: 'ヒュムノス、律史前月読、アルシエラの記述を支援するテキストエディタです。' },
    { property: 'og:title', content: 'ヒュムネエディタ' },
    { property: 'og:description', content: 'ヒュムノス、律史前月読、アルシエラの記述を支援するテキストエディタです。' },
    { property: 'og:url', content: 'https://hymmnogram.fau-varda.net/editor' },
  ],
  link: [
    { rel: 'canonical', href: 'https://hymmnogram.fau-varda.net/editor' },
  ],
});
</script>
