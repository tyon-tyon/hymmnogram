<template>
  <Layout :breadcrumb-links="[]">
    <div class="mb-4 flex gap-2">
      <UInput class="flex-1" v-model="keyword" placeholder="検索したいキーワードを入力" @keyup.enter="search" />
      <UButton @click="search">検索</UButton>
    </div>
    <div class="pt-4">
      <Readme />
    </div>
  </Layout>
</template>

<script setup lang="ts">
const keyword = ref("");
const search = () => {
  navigateTo("/dictionary?q=" + keyword.value);
};
const title = "HYMMNOGRAM(ヒュムノグラム) – ヒュムノス語辞書・歌詞データベース";
const description = "HYMMNOGRAM(ヒュムノグラム)は、アルトネリコ・サージュコンチェルトシリーズに登場する言語『ヒュムノス語』の非公式辞書サイトです。 単語データは トリフィラ を元に運営者が作成しています。";
useHead({
  title,
  meta: [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://hymmnogram.fau-varda.net" },
  ],
  link: [
    { rel: "canonical", href: "https://hymmnogram.fau-varda.net" },
  ],
});

let timer: NodeJS.Timeout;
watch(keyword, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    search();
  }, 1000);
});
</script>
