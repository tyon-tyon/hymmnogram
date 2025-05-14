<template>
  <UVerticalNavigation
    :links="links"
    :ui="{
      size: 'text-md',
    }"
  />
</template>

<script setup lang="ts">
const links = [
  {
    label: "ホーム",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "辞書",
    icon: "i-heroicons-table-cells",
    to: "/dictionary",
  },
  {
    label: "歌詞一覧",
    icon: "i-heroicons-book-open",
    to: "/lyrics",
  },
  {
    label: "ヒュムネエディタ",
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
