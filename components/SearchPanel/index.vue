<template>
  <UTextarea v-model="keyword" :rows="1" autoresize class="mb-4" placeholder="ヒュムノス辞書で検索したいキーワードを入力" />
  <UTabs v-model="tab" :items="items" class="w-full">
    <template #default="{ item, selected }">
      <span class="truncate" :class="[selected && 'text-primary-500 dark:text-primary-400']">{{ item.label }}</span>
    </template>
    <template #item="{ item }">
      <SearchPanelHymmnos v-if="item.key === 'hymmnos'" v-model:keyword="keyword" />
      <SearchPanelForeluna v-if="item.key === 'foreluna'" :keyword="keyword" />
      <SearchPanelArCiela v-if="item.key === 'arCiela'" :keyword="keyword" />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
const keyword = ref("");
const tab = ref(0);
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
const router = useRouter();
// 文字が入力されたら?q=を追加
watch([keyword, tab], (value) => {
  if (value) {
    router.replace({ query: { q: value[0], t: value[1] } });
  }
});

onBeforeMount(() => {
  // ページが読み込まれたら?keyword=を取得
  const q = router.currentRoute.value.query.q;
  const t = router.currentRoute.value.query.t;
  if (q) {
    keyword.value = q as string;
  }
  if (t) {
    tab.value = Number(t);
  }
});
onMounted(() => {
  const textarea = document.querySelector("textarea");
  if (textarea) {
    textarea.focus();
  }
});
</script>
