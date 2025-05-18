<template>
  <Layout :breadcrumb-links="[{ label: '歌詞一覧', to: '/lyrics' }]">
    <AtomH2>歌詞一覧</AtomH2>
    <AtomP class="text-sm">
      アルトネリコおよびサージュコンチェルトシリーズの楽曲の歌詞の一覧（途中）です。<br />
      ヒュムノス語、律史前月読、アルシエラが使用されている楽曲を優先して公開しています。<br />
      ヒュムノス語は意味と読みを併記しています。<br />
    </AtomP>
    <ClientOnly>
      <template #fallback>
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
      </template>
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
      <UAccordion :items="accordionItems" class="mb-4" :ui="{ wrapper: 'w-full flex flex-col' }">
        <template #tags>
          <div v-for="tagObject in tags" :key="tagObject.category" class="mb-4">
            <AtomH3>{{ tagObject.category }}</AtomH3>
            <div class="flex flex-wrap gap-2">
              <AtomLink v-for="(tag, index) in tagObject.tags" :key="index"
                :href="`/lyrics/?tag=${encodeURIComponent(tag)}`" class="text-sm" @click="selectedTag = tag">
                #{{ tag }}
              </AtomLink>
            </div>
          </div>
        </template>
      </UAccordion>
    </ClientOnly>
  </Layout>
</template>

<script setup lang="ts">
const { getMusicTags, getMusicByTag } = useLyrics();
const tags = getMusicTags();
const route = useRoute();
const selectedTag = ref<string | null>(route.query.tag as string | null);
const musics = ref(getMusicByTag(selectedTag.value ?? undefined));
const title = computed(() => (selectedTag.value ? `#${selectedTag.value} の` : '') + '歌詞一覧');

useHead({
  title: title,
  meta: [
    { property: 'og:title', content: title },
    { name: 'description', content: 'アルトネリコおよびサージュコンチェルトシリーズの楽曲の歌詞の一覧（途中）です。ヒュムノス語、律史前月読、アルシエラが使用されている楽曲を優先して公開しています。' },
    { property: 'og:description', content: 'アルトネリコおよびサージュコンチェルトシリーズの楽曲の歌詞の一覧（途中）です。ヒュムノス語、律史前月読、アルシエラが使用されている楽曲を優先して公開しています。' },
    { property: 'og:url', content: 'https://hymmnogram.fau-varda.net/lyrics' },
  ],
  link: [
    { rel: 'canonical', href: 'https://hymmnogram.fau-varda.net/lyrics' },
  ],
});

watch(selectedTag, () => {
  useHead({
    title: title,
    meta: [
      { property: 'og:title', content: title },
      { name: 'description', content: '歌詞一覧' },
    ],
  });
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
    defaultOpen: true,
  },
];

watch(selectedTag, () => {
  musics.value = getMusicByTag(selectedTag.value ?? undefined);
});
</script>
