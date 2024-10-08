<template>
  <UTextarea
    v-model="keyword"
    :rows="1"
    autoresize
    class="mb-4"
    placeholder="ヒュムノス辞書で検索したいキーワードを入力"
  />
  <SearchPanelHymmnosResult v-if="keyword.length" :keyword="keyword" />
</template>

<script setup lang="ts">
const keyword = ref("");
</script>

<style></style>
