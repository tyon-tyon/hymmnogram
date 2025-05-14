<template>
  <template v-if="mode === 'hymmnos'">
    <TableHymmnos @input-word="addWord" :action="true" :defaultRowCount="5"
      :showColumns="['hymmnos', 'japanese', 'actions']" v-model:keyword="keyword" />
    <LyricTable :lyrics="lyrics" :word="lyricWord.hymmnos" />
  </template>
  <template v-if="mode === 'arCiela'">
    <ArCielaKeyboard @input="addText" @delete="deleteText" @replace="replaceArCielaChar" :keyword="keyword"
      :cursorLine="cursorLine" :cursorPosition="cursorPositionInLine" />
  </template>
  <template v-if="mode === 'foreluna'">
    <ForelunaKeyboard @input-char="addText" @delete-char="deleteText" :keyword="keyword" />
  </template>
</template>

<script setup lang="ts">
import type { TWord, TLyric } from "~/types";
const props = defineProps<{
  mode: "hymmnos" | "arCiela" | "foreluna";
}>();
const keyword = defineModel<string>("keyword", { required: true });
const dictionary = useDictionary();
const lyric = useLyrics();
const {
  addWord,
  addText,
  deleteText,
  replaceText,
  cursorPosition,
  cursorLine,
  textareaText,
} = useEditor();
const { emptyWordData } = useDictionary();

const lyrics = ref<TLyric[]>([]);
const lyricWord = ref<TWord>(emptyWordData);

let timer: NodeJS.Timeout | undefined;
watch(
  () => keyword.value,
  () => {
    if (timer) clearTimeout(timer);
    const { mode } = props;
    if (mode !== "hymmnos") return;

    if (keyword.value.length === 0) {
      lyrics.value = [];
      return;
    }

    timer = setTimeout(() => {
      searchHymmnos(keyword.value);
    }, 300);
  }
);

const searchHymmnos = (keyword: string) => {
  // 部分一致検索
  const words = dictionary.getPartialMatch(keyword);
  lyrics.value = lyric.getMatchHymmnos(keyword);
  // 用例で使う単語を取得
  lyricWord.value =
    // 完全一致するヒュムノス単語がある場合はそれを使用
    words.find(
      (w) =>
        w.hymmnos === keyword ||
        (w.subWords?.length && w.subWords[0].hymmnos === keyword)
    ) ?? {
      // ない場合は空のワードデータを使用
      ...emptyWordData,
      hymmnos: keyword,
    };
};

// 現在のカーソル位置がその行の何文字目か
const cursorPositionInLine = computed(() => {
  const beforeCursorText = textareaText.value.substring(
    0,
    cursorPosition.value
  );
  const cursorLineIndex = beforeCursorText.lastIndexOf("\n") + 1;
  return cursorPosition.value - cursorLineIndex;
});

// カーソル位置のアルシエラ文字を修正
const replaceArCielaChar = ({
  start,
  end,
  text,
}: {
  start: number;
  end: number;
  text: string;
}) => {
  // カーソルのある行の冒頭までの文字数
  const beforeCursorText = textareaText.value.substring(
    0,
    cursorPosition.value
  );
  const cursorLineIndex = beforeCursorText.lastIndexOf("\n") + 1;
  replaceText(cursorLineIndex + start, cursorLineIndex + end, text);
};
</script>
