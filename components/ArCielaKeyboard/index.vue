<template>
  <div class="flex items-center flex-col">
    <UButtonGroup size="xs" orientation="horizontal" class="mb-1">
      <UButton
        :color="mode === 'compartment' ? 'primary' : 'white'"
        @click="mode = 'compartment'"
      >
        コンパートメント
      </UButton>
      <UButton
        :color="mode === 'arciela_font' ? 'primary' : 'white'"
        @click="mode = 'arciela_font'"
      >
        アルシエラフォント
      </UButton>
      <UButton
        :color="mode === 'none' ? 'primary' : 'white'"
        @click="mode = 'none'"
      >
        なし
      </UButton>
    </UButtonGroup>
    <ArCielaKeyboard-CharDetail
      v-if="cursorArcielaChar"
      :char="cursorArcielaChar"
      @change="replace"
    />
    <div class="keyboard">
      <ArCielaKeyboard-Board
        :keyword="keyword"
        @input="input"
        @delete="emit('delete')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TArcielaCharData } from "~/types";

const props = defineProps<{
  keyword: string;
  cursorPosition: number;
  cursorLine: string;
}>();

const emit = defineEmits(["input", "delete", "replace"]);
const { getArcielaWord, getCompartmentStr } = useArciela();

const mode = ref<"none" | "compartment" | "arciela_font">("compartment");

const arcielaWords = ref<string[]>([]);
const cursorWordIndex = ref(0);
const cursorCharIndex = ref(0);
const cursorInWord = ref(0);

const cursorArcielaChar = computed(() => {
  // カーソル位置がアルシエラ単語の範囲外の場合
  if (
    cursorWordIndex.value === -1 ||
    arcielaWords.value.length === 0 ||
    cursorInWord.value === 0
  ) {
    return;
  }
  // カーソル位置のアルシエラ単語を取得
  const cursorArcielaWord = getArcielaWord(
    arcielaWords.value[cursorWordIndex.value]
  );
  // カーソル位置の文字を取得
  let arcielaInputLength = 0;
  for (let i = 0; i < cursorArcielaWord.length; i++) {
    const char = cursorArcielaWord[i];
    arcielaInputLength += (char.input ?? "").length;
    if (cursorInWord.value <= arcielaInputLength) {
      cursorCharIndex.value = i;
      return char;
    }
  }
  return null;
});

// カーソル位置からアルシエラ単語を取得
watch(
  () => [props.cursorPosition, props.cursorLine],
  () => {
    const { cursorPosition, cursorLine } = props;
    // アルシエラ単語ごとに分割
    const line = cursorLine + "\n";
    const chars = line.split("");
    let arcielaWordsIndex = 0;
    arcielaWords.value = [""];
    cursorWordIndex.value = -1;
    cursorInWord.value = 0;
    // 区切り文字
    const separator = /[\s,.]/;
    for (let i = 0; i < chars.length; i++) {
      if (i === cursorPosition) {
        // カーソル位置の単語と文字位置を設定
        cursorWordIndex.value = arcielaWordsIndex;
        cursorInWord.value = arcielaWords.value[arcielaWordsIndex].length;
      }
      if (i !== 0) {
        // 前の文字が空白ではなく、現在の文字が空白ならarrayのindexを進める
        if (
          (!chars[i - 1].match(separator) && chars[i].match(separator)) ||
          (chars[i - 1].match(separator) && !chars[i].match(separator))
        ) {
          arcielaWordsIndex++;
          arcielaWords.value[arcielaWordsIndex] = "";
        }
      }
      arcielaWords.value[arcielaWordsIndex] += chars[i];
    }
  }
);

// キーボード入力
const input = ({ char, session }: { char: string; session: number }) => {
  emit("input", char.toLocaleLowerCase());
};

// セッション・エンベロープ修正
const replace = (char: TArcielaCharData) => {
  if (!char.input) return;
  // 開始位置と終了位置を取得
  let beforeText = "";
  let start = 0;
  let end = 0;
  for (let i = 0; i < arcielaWords.value.length; i++) {
    if (i === cursorWordIndex.value) {
      const cursorArcielaWord = getArcielaWord(arcielaWords.value[i]);
      for (let j = 0; j < cursorCharIndex.value; j++) {
        beforeText += cursorArcielaWord[j].input ?? "";
      }
      start = beforeText.length;
      end = start + (char.input ?? "").length;
      break;
    }
    beforeText += arcielaWords.value[i];
  }
  // セッション・エンベロープを修正
  const text = getCompartmentStr(char.char, char.session, char.envelope);
  emit("replace", { start, end, text });
};
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
