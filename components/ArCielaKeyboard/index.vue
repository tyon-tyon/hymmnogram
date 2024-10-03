<template>
  {{ cursorArcielaChar?.input }}
  <ArCielaKeyboard-Board
    :keyword="keyword"
    @input-char="emit('input-char', $event)"
    @delete-char="emit('delete-char')"
  />
</template>

<script setup lang="ts">
defineProps<{
  keyword: string;
}>();

const emit = defineEmits(["input-char", "delete-char"]);

const { textareaText, cursorPosition, cursorLine } = useEditor();
const { getArcielaWord } = useArciela();

// 現在のカーソル位置がその行の何文字目かを取得する関数
const getCursorLineIndexInLine = (text: string, cursor: number) => {
  const beforeCursorText = text.substring(0, cursor);
  const cursorLineIndex = beforeCursorText.lastIndexOf("\n") + 1;
  return cursor - cursorLineIndex;
};

// カーソル位置にある文字を取得
const cursorArcielaChar = computed(() => {
  // 現在のカーソル位置がその行の何文字目か
  const text = textareaText.value;
  const cursor = cursorPosition.value;
  const cursorInLine = getCursorLineIndexInLine(text, cursor);

  // アルシエラ単語ごとに分割
  const line = cursorLine.value;
  const chars = line.split("");
  const arcielaWords: string[] = [""];
  let arcielaWordsIndex = 0;
  let cursorArcielaWordIndex = 0;
  let cursorInWord = 0;
  // 区切り文字
  const separator = /[\s,.]/;
  for (let i = 0; i < chars.length; i++) {
    // カーソル位置のアルシエラ単語のindexを取得
    if (i === cursorInLine) {
      cursorArcielaWordIndex = arcielaWordsIndex;
      cursorInWord = arcielaWords[arcielaWordsIndex].length - 1;
    }
    if (i !== 0) {
      // 前の文字が空白ではなく、現在の文字が空白ならarrayのindexを進める
      if (
        (!chars[i - 1].match(separator) && chars[i].match(separator)) ||
        (chars[i - 1].match(separator) && !chars[i].match(separator))
      ) {
        arcielaWordsIndex++;
        arcielaWords[arcielaWordsIndex] = "";
      }
    }
    arcielaWords[arcielaWordsIndex] += chars[i];
  }
  // カーソル位置のアルシエラ単語を取得
  const cursorArcielaWord = getArcielaWord(
    arcielaWords[cursorArcielaWordIndex]
  );
  // カーソル位置の文字を取得
  let arcielaInputLength = 0;
  for (const char of cursorArcielaWord) {
    arcielaInputLength += (char.input ?? "").length;
    if (cursorInWord < arcielaInputLength) {
      return char;
    }
  }
  return null;
});
</script>
