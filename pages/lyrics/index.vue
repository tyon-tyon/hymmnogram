<template>
  <Layout>
    <AtomH2>ヒュムノス歌詞一覧</AtomH2>
    <div v-if="selectedTag" class="mb-4" id="selected-tag">
      絞り込み条件: #{{ selectedTag }}
      <AtomChipButton @click="selectedTag = null">クリア</AtomChipButton>
    </div>
    <UTable :ui="{
      th: {
        padding: 'hidden',
      },
      td: {
        padding: 'px-0',
      },
    }" :columns="columns" :rows="musics">
      <template #title-data="{ row }">
        <AtomLink :href="`/lyrics/${row.key}`">
          {{ row.title }}
        </AtomLink>
      </template>
    </UTable>
    <UAccordion :items="accordionItems" class="mb-4">
      <template #tags>
        <div class="flex flex-wrap">
          <AtomLink v-for="(tag, index) in tags" :key="index" :href="`/lyrics/?tag=${tag}#selected-tag`"
            class="text-sm mr-2" @click="selectedTag = tag">
            #{{ tag }}
          </AtomLink>
        </div>
      </template>
    </UAccordion>
  </Layout>
</template>

<script setup lang="ts">
const { getMusicTags, getMusicByTag } = useLyrics();
const tags = getMusicTags();
const route = useRoute();
const selectedTag = ref<string | null>(route.query.tag as string | null);
const musics = ref(getMusicByTag(selectedTag.value ?? undefined));
const title = computed(() => (selectedTag.value ? `${selectedTag.value}の` : '') + 'ヒュムノス歌詞一覧');

useHead({
  title,
  meta: [
    { property: 'og:title', content: title },
    { name: 'description', content: 'ヒュムノス歌詞一覧' },
  ],
});

const columns = [
  {
    label: 'タイトル',
    key: 'title',
  },
];

const accordionItems = [
  {
    label: '絞り込みタグ一覧',
    slot: "tags",
  },
];

watch(selectedTag, () => {
  musics.value = getMusicByTag(selectedTag.value ?? undefined);
});
</script>
