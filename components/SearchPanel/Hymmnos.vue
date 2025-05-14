<template>
  <div v-if="lineWords.length" class="mb-5">
    <div v-if="lineWords.flat().length > 5" class="text-sm">
      長文の意味を調べる場合は<AtomLink href="/editor">ヒュムネエディタ</AtomLink>がおすすめです。
    </div>
    <div v-for="(line, index) in lineWords" :key="index">
      <div :rows="lineWords" class="flex flex-wrap">
        <WordHymmnos v-for="(word, index) in line" :word="word" :key="index" class="pr-4 pt-4" pronunciation />
      </div>
    </div>
  </div>
  <UAccordion v-if="keyword.length" multiple :items="lineWords.length ? [items[1]] : items">
    <template #partial-match>
      <TableHymmnos v-model:keyword="keyword" />
    </template>
    <template #lyrics v-if="keyword.length">
      <LyricTable :lyrics="foundLyrics" :word="(exactMatchWord?.subWords?.length
        ? exactMatchWord?.subWords[0]
        : exactMatchWord ?? { ...emptyWordData, hymmnos: keyword }
      ).hymmnos
        " />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
const keyword = defineModel<string>("keyword", { required: true });
const dictionary = useDictionary();
const { emptyWordData } = dictionary;
const lyrics = useLyrics();

const items = [
  {
    label: "単語",
    slot: "partial-match",
    defaultOpen: true,
  },
  {
    label: "用例",
    slot: "lyrics",
    defaultOpen: true,
  },
];

const lineWords = computed(() => {
  // ヒュムノスの文章の意味を調べる
  if (keyword.value.match(/([\!\?\s,]|\/.)/)) return dictionary.getWords(keyword.value);
  return [];
});

// 完全一致検索
const exactMatchWord = computed(() => {
  return dictionary.getExactMatch(keyword.value);
});

// 用例検索
const foundLyrics = computed(() => {
  // 完全一致を優先させる
  const exactMatchWordBase = exactMatchWord.value?.subWords?.[0]?.hymmnos;
  const exactMatchLyrics = exactMatchWordBase
    ? lyrics.getMatchHymmnos(exactMatchWordBase)
    : [];
  // 重複を削除
  return [...exactMatchLyrics, ...lyrics.getMatchHymmnos(keyword.value)];
});
</script>
