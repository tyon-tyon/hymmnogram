<template>
  <div class="flex items-center flex-col">
    <div v-if="cursorArcielaChar?.char.match(/[^aiueon]/)" class="flex w-full px-2">
      <div class="flex flex-col text-center">
        <div class="font-arciela text-5xl mb-2">
          {{ geFontStr(cursorArcielaChar) }}
        </div>
        <div class="text-sm">
          {{ getCompartmentStr(cursorArcielaChar) }}
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <UButtonGroup size="xs" orientation="horizontal" class="mb-1">
          <UButton
            v-for="n in 5"
            class="flex-1 items-center justify-center px-1"
            :color="cursorArcielaChar.session == n - 1 ? 'primary' : 'white'"
          >
            {{ getSessions(cursorArcielaChar.meanings)[n - 1].join(" ") }}
          </UButton>
        </UButtonGroup>
        <UButtonGroup size="xs" orientation="horizontal">
          <UButton
            v-for="envelope in envelopes"
            class="flex-1 items-center justify-center"
            :color="
              cursorArcielaChar.envelope == envelope ? 'primary' : 'white'
            "
          >
            {{ envelope }}
          </UButton>
        </UButtonGroup>
      </div>
    </div>
    <div class="keyboard">
      <ArCielaKeyboard-Board
        :keyword="keyword"
        @input-char="emit('input-char', $event)"
        @delete-char="emit('delete-char')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  keyword: string;
}>();

const emit = defineEmits(["input-char", "delete-char"]);

const { textareaText, cursorPosition, cursorLine } = useEditor();
const { getArcielaWord, getSessions, envelopes, getCompartmentStr, geFontStr } =
  useArciela();

const cursorInWord = ref(0);
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
  const line = cursorLine.value + "\n";
  const chars = line.split("");
  const arcielaWords: string[] = [""];
  let arcielaWordsIndex = 0;
  let cursorArcielaWordIndex = -1;
  cursorInWord.value = 0;
  // 区切り文字
  const separator = /[\s,.]/;
  for (let i = 0; i < chars.length; i++) {
    // カーソル位置のアルシエラ単語のindexを取得
    if (i === cursorInLine) {
      cursorArcielaWordIndex = arcielaWordsIndex;
      cursorInWord.value = arcielaWords[arcielaWordsIndex].length;
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
  if (cursorArcielaWordIndex === -1) return null;

  // カーソル位置のアルシエラ単語を取得
  const cursorArcielaWord = getArcielaWord(
    arcielaWords[cursorArcielaWordIndex]
  );
  // カーソル位置の文字を取得
  let arcielaInputLength = 0;
  for (const char of cursorArcielaWord) {
    arcielaInputLength += (char.input ?? "").length;
    if (cursorInWord.value <= arcielaInputLength) {
      return char;
    }
  }
  return null;
});
</script>

<style scoped>
.keyboard {
  max-width: 720px;
  box-sizing: content-box;
  width: calc(100% - 60px);
  margin: auto;
  padding-bottom: 34px;
}
</style>
