<template>
  <Layout>
    <UTextarea
      v-model="keyword"
      :rows="1"
      autoresize
      class="mb-4"
      placeholder="ヒュムノス辞書で検索したいキーワードを入力"
    />
    <div v-if="!openReadme" class="mb-4">
      <SearchPanel :keyword="keyword" />
    </div>
    <div class="border-t-2 border-cool-200 pt-4">
      <Readme />
    </div>
  </Layout>
</template>

<script setup lang="ts">
const keyword = ref("");
const openReadme = ref(true);

watch(
  () => keyword.value,
  () => {
    if (keyword.value.length) openReadme.value = false;
  }
);
</script>

<style scoped>
.readme {
  
}
</style>
