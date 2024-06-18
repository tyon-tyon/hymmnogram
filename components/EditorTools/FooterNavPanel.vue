<template>
  <template v-if="mode === 'hymmnos'">
    <HymmnosTable :words="words" @input-word="addWord" :action="true" />
    <ExampleTable :examples="examples" :word="exampleWord" />
  </template>
  <template v-if="mode === 'arciela'">
    <ArCielaKeyboard
      @input-char="addText"
      @delete-char="deleteText"
      :keyword="keyword"
    />
  </template>
  <template v-if="mode === 'foreluna'">
    <ForelunaKeyboard
      @input-char="addText"
      @delete-char="deleteText"
      :keyword="keyword"
    />
  </template>
</template>

<script setup lang="ts">
import type { TWordData, TJsonExampleData } from "~/types";
const props = defineProps<{
  mode: "hymmnos" | "arciela" | "foreluna";
  keyword: string;
}>();
const dictionary = useDictionary();
const example = useExample();
const { addWord, addText, deleteText } = useEditor();
const { emptyWordData } = useDictionary();

const words = ref<TWordData[]>([]);
const examples = ref<TJsonExampleData[]>([]);
const exampleWord = ref<TWordData>(emptyWordData);

let timer: NodeJS.Timeout | undefined;
watch(
  () => props.keyword,
  () => {
    if (timer) clearTimeout(timer);
    const { mode, keyword } = props;
    if (mode !== "hymmnos") return;

    if (keyword.length === 0) {
      words.value = [];
      examples.value = [];
      return;
    }

    timer = setTimeout(() => {
      searchHymmnos(keyword);
    }, 300);
  }
);

const searchHymmnos = (keyword: string) => {
  // 部分一致検索
  words.value = dictionary.getPartialMatch(keyword);
  examples.value = example.getPartialMatch(keyword);
  // 用例で使う単語を取得
  exampleWord.value =
    // 完全一致するヒュムノス単語がある場合はそれを使用
    words.value.find(
      (w) =>
        w.hymmnos === keyword ||
        (w.subWords?.length && w.subWords[0].hymmnos === keyword)
    ) ?? {
      // ない場合は空のワードデータを使用
      ...emptyWordData,
      hymmnos: keyword,
    };
};
</script>
