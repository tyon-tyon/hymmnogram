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
    label: "ヒュムノス歌詞一覧",
    icon: "i-heroicons-book-open",
    to: "/lyrics",
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
  {
    label: "お問合せ",
    icon: "i-heroicons-chat-bubble-left-right",
    to: "https://marshmallow-qa.com/bfpkhciwx4ix2d3",
  },
];
</script>
