<template>
  <template v-if="mode === 'hymmnos'">
    <TableHymmnos
      :words="words"
      @input-word="addWord"
      :action="true"
      :defaultRowCount="5"
    />
    <LyricTable :lyrics="lyrics" :word="lyricWord.hymmnos" />
  </template>
  <template v-if="mode === 'arciela'">
    <ArCielaKeyboard
      @input="addText"
      @delete="deleteText"
      @replace="replaceArcielaChar"
      :keyword="keyword"
      :cursorLine="cursorLine"
      :cursorPosition="cursorPositionInLine"
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
import type { TWord, TLyric, TArcielaChar } from "~/types";
const props = defineProps<{
  mode: "hymmnos" | "arciela" | "foreluna";
  keyword: string;
}>();
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

const words = ref<TWord[]>([]);
const lyrics = ref<TLyric[]>([]);
const lyricWord = ref<TWord>(emptyWordData);

let timer: NodeJS.Timeout | undefined;
watch(
  () => props.keyword,
  () => {
    if (timer) clearTimeout(timer);
    const { mode, keyword } = props;
    if (mode !== "hymmnos") return;

    if (keyword.length === 0) {
      words.value = [];
      lyrics.value = [];
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
  lyrics.value = lyric.getMatchHymmnos(keyword);
  // 用例で使う単語を取得
  lyricWord.value =
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
const replaceArcielaChar = ({
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
