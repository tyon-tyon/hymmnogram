<template>
  <UTextarea
    v-model="keyword"
    :rows="1"
    autoresize
    class="mb-4"
    placeholder="ヒュムノス辞書で検索したいキーワードを入力"
  />
  <UTabs :items="items" class="w-full">
    <template #default="{ item, selected }">
      <span
        class="truncate"
        :class="[selected && 'text-primary-500 dark:text-primary-400']"
        >{{ item.label }}</span
      >
    </template>
    <template #item="{ item }">
      <SearchPanelHymmnos v-if="item.key === 'hymmnos'" :keyword="keyword" />
      <SearchPanelForeluna v-if="item.key === 'foreluna'" :keyword="keyword" />
      <SearchPanelArCiela v-if="item.key === 'arCiela'" :keyword="keyword" />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
const keyword = ref("");
const items = [
  {
    key: "hymmnos",
    label: "ヒュムノス",
  },
  {
    key: "foreluna",
    label: "律史前月読(月奏)",
  },
  {
    key: "arCiela",
    label: "アルシエラ(星語)",
  },
];
</script>
