<template>
  <Layout :breadcrumb-links="[]">
    <ClientOnly>
      <SearchPanel/>
    </ClientOnly>
  </Layout>
</template>

<script setup lang="ts">
const title = "HYMMNOGRAM(ヒュムノグラム) – ヒュムノス語辞書・歌詞データベース";
const description = "HYMMNOGRAM(ヒュムノグラム)は、アルトネリコ・サージュコンチェルトシリーズに登場する言語『ヒュムノス語』の非公式辞書サイトです。 単語データは トリフィラ を元に運営者が作成しています。";
useHead({
  title,
  meta: [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://hymmnogram.fau-varda.net/dictionary" },
  ],
  link: [
    { rel: "canonical", href: "https://hymmnogram.fau-varda.net/dictionary" },
  ],
});
</script>
