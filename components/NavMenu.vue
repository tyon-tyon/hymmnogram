<template>
  <UVerticalNavigation
    :links="links"
    :ui="{
      size: 'text-md',
    }"
  />
</template>

<script setup lang="ts">
const isOpen = ref(false);

const links = [
  {
    label: "ヒュムノス辞書",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "ヒュムノスエディタ",
    icon: "i-heroicons-pencil",
    to: "/editor",
  },
  {
    label: "オリジナル単語登録",
    icon: "i-heroicons-document-text",
    to: "/original-words",
  },
];
</script>
