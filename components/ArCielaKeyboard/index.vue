<template>
  <div class="flex flex-col">
    <div class="control px-2">
      <div class="flex justify-end mb-2">
        <UPopover :popper="{ placement: 'top-end' }">
          <UButton
            size="xs"
            color="white"
            :label="getModeJp(mode)"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
          <template #panel>
            <UButtonGroup size="xs" orientation="horizontal">
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
                アルファベット
              </UButton>
            </UButtonGroup>
          </template>
        </UPopover>
      </div>
      <ArCielaKeyboard-CharDetail
        v-if="cursorArcielaChar"
        :char="cursorArcielaChar"
        @change="replace"
        class="mb-2"
      />
    </div>
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
const { getArcielaWord, getCompartmentStr, geFontStr } = useArciela();

const mode = ref<"none" | "compartment" | "arciela_font">("compartment");
const getModeJp = (mode: string) => {
  switch (mode) {
    case "compartment":
      return "コンパートメント";
    case "arciela_font":
      return "アルシエラフォント";
    case "none":
      return "アルファベット";
  }
};

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
    // モード修正
    if (cursorLine.match(/[\!\#\$\%\&\(\)]/)) {
      mode.value = "arciela_font";
    } else if (cursorLine.match(/^[a-z,. ]$/)) {
      mode.value = "none";
    } else {
      mode.value = "compartment";
    }
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

const getArcielaWordStr = (
  char: string,
  session: number,
  envelope?: TArcielaCharData["envelope"]
) => {
  let text = char;
  switch (mode.value) {
    case "compartment":
      text = getCompartmentStr(char, session, envelope);
      break;
    case "arciela_font":
      text = geFontStr(char, session, envelope);
      break;
  }
  return text;
};
// キーボード入力
const input = ({ char, session }: { char: string; session: number }) => {
  emit("input", getArcielaWordStr(char, session));
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

  emit("replace", {
    start,
    end,
    text: getArcielaWordStr(char.char, char.session ?? 0, char.envelope),
  });
};
</script>

<style scoped>
.control {
  max-width: 720px;
  width: 100%;
  margin: auto;
}
.keyboard {
  max-width: 720px;
  box-sizing: content-box;
  width: calc(100% - 60px);
  margin: auto;
  padding-bottom: 34px;
}
</style>
