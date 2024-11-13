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
      {{ props.keyword.replace(/[^a-z\.\!\?\-\=\/\>\<\_\:\s]+/g, "") }}
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
            : exactMatchWord ?? { ...emptyWordData, hymmnos: props.keyword }
        "
      />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
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

const lineWords = computed(() => {
  const keyword = props.keyword;
  // ヒュムノスの文章の意味を調べる
  if (keyword.match(/([\!\?\s,]|\/.)/)) {
    // 行と単語に分割
    const lines = splitTextIntoLinesAndWords(keyword);

    const words = lines.map((line) =>
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
    // wordsの中にパスタリエがない場合はそのまま返す
    if (!words.flat().some((word) => word.dialect === "pastalie")) {
      return words;
    }
    // 実質tie専用の対応
    // パスタリエ指定で単語を再取得
    return words.map((line) =>
      line.map((word) => {
        if (word.hymmnos !== "pastalie") {
          return dictionary.getExactMatch(word.hymmnos, "pastalie") || word;
        }
        return word;
      })
    );
  }
  return [];
});

// 完全一致検索
const exactMatchWord = computed(() => {
  return dictionary.getExactMatch(props.keyword);
});

// 部分一致検索
const partialMatchWords = computed(() => {
  // 完全一致と重複しないようにする
  const exactMatchWordBase = exactMatchWord.value?.subWords?.[0]?.hymmnos;
  return dictionary
    .getPartialMatch(props.keyword)
    .filter(
      (word) =>
        !(
          exactMatchWord.value &&
          (word.hymmnos == exactMatchWord.value.hymmnos ||
            word.hymmnos == exactMatchWordBase) &&
          word.dialect == exactMatchWord.value.dialect
        )
    );
});

// 用例検索
const foundExamples = computed(() => {
  // 完全一致を優先させる
  const exactMatchWordBase = exactMatchWord.value?.subWords?.[0]?.hymmnos;
  const exactMatchExamples = exactMatchWordBase
    ? example.getPartialMatch(exactMatchWordBase)
    : [];
  // 重複を削除
  return [
    ...exactMatchExamples,
    ...example.getPartialMatch(props.keyword),
  ].filter((v, i, a) => a.findIndex((t) => t.hymmnos === v.hymmnos) === i);
});
</script>
