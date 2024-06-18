<template>
  <div v-if="lineWords.length">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
      style="min-height: 70px"
    >
      <div :rows="lineWords" style="display: flex; flex-wrap: wrap">
        <HymmnosWord v-for="(word, index) in line" :word="word" :key="index" />
        <HymmnosWord :word="emptyWordData" style="flex: 1000 1 auto" />
      </div>
    </div>

    <div
      class="text-3xl my-2"
      style="
        font-family: 'Hymmnos';
        white-space: pre;
        text-wrap: wrap;
        word-wrap: normal;
      "
    >
      {{ keyword.replace(/[^a-z\.\!\?\-\=\/\>\<\_\:\s]+/g, "") }}
    </div>
  </div>
  <UAccordion v-else multiple :items="items">
    <template #partial-match>
      <HymmnosTable :words="partialMatchWords" :exact-word="exactMatchWord" />
    </template>
    <template #examples>
      <ExampleTable
        :examples="foundExamples"
        :word="
          exactMatchWord?.subWords?.length
            ? exactMatchWord?.subWords[0]
            : exactMatchWord ?? { ...emptyWordData, hymmnos: keyword }
        "
      />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { TWordData } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const dictionary = useDictionary();
const { emptyWordData } = dictionary;
const example = useExample();
const { splitTextIntoLinesAndWords } = useTextProcessor();

const items = [
  {
    label: "単語",
    slot: "partial-match",
    defaultOpen: true,
  },
  {
    label: "用例",
    slot: "examples",
    defaultOpen: true,
  },
];

const partialMatchWords = ref<TWordData[]>([]);
const exactMatchWord = ref<TWordData | undefined>();
const foundExamples = ref<any[]>([]);
const lineWords = ref<TWordData[][]>([]);

let timer: NodeJS.Timeout | undefined;
watch(
  () => props.keyword,
  () => {
    if (timer) clearTimeout(timer);
    const keyword = props.keyword;
    if (!keyword.length) {
      exactMatchWord.value = undefined;
      partialMatchWords.value = [];
      foundExamples.value = [];
      lineWords.value = [];
      return;
    }
    timer = setTimeout(search, 500);
  }
);

const search = () => {
  console.log("search");
  const keyword = props.keyword;
  // ヒュムノスの文章の意味を調べる
  lineWords.value = [];
  if (keyword.match(/([\!\?\s,]|\/.)/)) {
    // 行と単語に分割
    const lines = splitTextIntoLinesAndWords(keyword);

    lineWords.value = lines.map((line) =>
      line.map((word) => {
        // 日本語が含まれている場合はそのまま表示
        if (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/)) {
          return { ...emptyWordData, word };
        }
        // 単語検索
        return (
          dictionary.getExactMatch(word) || {
            ...emptyWordData,
            hymmnos: word,
          }
        );
      })
    );
    return;
  }
  // 単語検索
  exactMatchWord.value = dictionary.getExactMatch(keyword);
  const exactMatchWordBase = exactMatchWord.value?.subWords?.[0]?.hymmnos;
  // 部分一致検索 完全一致と重複しないようにする
  partialMatchWords.value = dictionary
    .getPartialMatch(keyword)
    .filter(
      (word) =>
        !(
          exactMatchWord.value &&
          (word.hymmnos == exactMatchWord.value.hymmnos ||
            word.hymmnos == exactMatchWordBase)
        )
    );
  // 用例検索
  const exactMatchExamples = exactMatchWordBase
    ? example.getPartialMatch(exactMatchWordBase)
    : [];
  // 重複を削除
  foundExamples.value = [
    ...exactMatchExamples,
    ...example.getPartialMatch(keyword),
  ].filter((v, i, a) => a.findIndex((t) => t.hymmnos === v.hymmnos) === i);
};
</script>

<style></style>
