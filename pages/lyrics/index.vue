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
        <AtomChipButton @click="clearSelectedTag">クリア</AtomChipButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UTable :ui="{
            th: {
              padding: 'hidden',
            },
            td: {
              padding: 'px-0',
            },
          }" :columns="columns" :rows="musics">
            <template #title-data="{ row }">
              <AtomLink :href="`/lyrics/${row.key}`" class="text-lg font-bold">
                {{ row.title }}
              </AtomLink>
              <div class="flex flex-wrap gap-0.5">
                <a v-for="tag in [...row.singer, ...row.tags]" :key="tag"
                  class="text-xs border border-gray-300 rounded-md px-1 hover:bg-gray-100 cursor-pointer"
                  @click="selectedTag = tag">
                  #{{ tag }}
                </a>
              </div>
            </template>
          </UTable>
        </div>
        <div>
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
        </div>
      </div>
    </ClientOnly>
  </Layout>
</template>

<script setup lang="ts">
const { getMusicTags, getMusicByTag } = useLyrics();
const tags = getMusicTags();
const route = useRoute();
const router = useRouter();

// Hydration mismatchを防ぐため、クライアントサイドで初期化
const selectedTag = ref<string | null>(null);
const musics = ref(getMusicByTag(undefined));

// クライアントサイドでのみクエリパラメータを処理
onMounted(() => {
  const tagFromQuery = route.query.tag as string | null;
  if (tagFromQuery) {
    selectedTag.value = tagFromQuery;
    musics.value = getMusicByTag(tagFromQuery);
  }
});

// 基本のメタデータを設定（クエリパラメータに依存しない）
useHead({
  title: '歌詞一覧',
  meta: [
    { property: 'og:title', content: '歌詞一覧' },
    { name: 'description', content: 'アルトネリコおよびサージュコンチェルトシリーズの楽曲の歌詞の一覧（途中）です。ヒュムノス語、律史前月読、アルシエラが使用されている楽曲を優先して公開しています。' },
    { property: 'og:description', content: 'アルトネリコおよびサージュコンチェルトシリーズの楽曲の歌詞の一覧（途中）です。ヒュムノス語、律史前月読、アルシエラが使用されている楽曲を優先して公開しています。' },
    { property: 'og:url', content: 'https://hymmnogram.fau-varda.net/lyrics/' },
  ],
  link: [
    { rel: 'canonical', href: 'https://hymmnogram.fau-varda.net/lyrics/' },
  ],
});

// selectedTagが変更された時にメタデータを更新
watch(selectedTag, (newTag) => {
  const currentTitle = newTag ? `#${newTag} の歌詞一覧` : '歌詞一覧';
  const currentUrl = 'https://hymmnogram.fau-varda.net/lyrics/' + (newTag ? `?tag=${encodeURIComponent(newTag)}` : '');

  useHead({
    title: currentTitle,
    meta: [
      { property: 'og:title', content: currentTitle },
      { property: 'og:url', content: currentUrl },
    ],
    link: [
      { rel: 'canonical', href: currentUrl },
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

const clearSelectedTag = () => {
  selectedTag.value = null;
  router.replace('/lyrics');
};
</script>