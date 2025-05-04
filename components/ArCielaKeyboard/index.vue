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
                :color="mode === 'arCiela_font' ? 'primary' : 'white'"
                @click="mode = 'arCiela_font'"
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
      <ArCielaKeyboardCharDetail
        v-if="cursorArCielaChar"
        :char="cursorArCielaChar"
        @change="replace"
        class="mb-2"
      />
    </div>
    <div class="keyboard">
      <ArCielaKeyboardBoard
        :keyword="keyword"
        @input="input"
        @delete="emit('delete')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TArCielaChar } from "~/types";

const props = defineProps<{
  keyword: string;
  cursorPosition: number;
  cursorLine: string;
}>();

const emit = defineEmits(["input", "delete", "replace"]);
const { getArCielaWord, getCompartmentStr, geFontStr } = useArCiela();

const mode = ref<"none" | "compartment" | "arCiela_font">("compartment");
const getModeJp = (mode: string) => {
  switch (mode) {
    case "compartment":
      return "コンパートメント";
    case "arCiela_font":
      return "アルシエラフォント";
    case "none":
      return "アルファベット";
  }
};

const arCielaWords = ref<string[]>([]);
const cursorWordIndex = ref(0);
const cursorCharIndex = ref(0);
const cursorInWord = ref(0);

const cursorArCielaChar = computed(() => {
  // カーソル位置がアルシエラ単語の範囲外の場合
  if (
    cursorWordIndex.value === -1 ||
    arCielaWords.value.length === 0 ||
    cursorInWord.value === 0
  ) {
    return;
  }
  // カーソル位置のアルシエラ単語を取得
  const cursorArCielaWord = getArCielaWord(
    arCielaWords.value[cursorWordIndex.value]
  );
  // カーソル位置の文字を取得
  let arCielaInputLength = 0;
  for (let i = 0; i < cursorArCielaWord.chars.length; i++) {
    const char = cursorArCielaWord.chars[i];
    arCielaInputLength += (char.input ?? "").length;
    if (cursorInWord.value <= arCielaInputLength) {
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
    let arCielaWordsIndex = 0;
    arCielaWords.value = [""];
    cursorWordIndex.value = -1;
    cursorInWord.value = 0;
    // 区切り文字
    const separator = /[\s,.]/;
    for (let i = 0; i < chars.length; i++) {
      if (i === cursorPosition) {
        // カーソル位置の単語と文字位置を設定
        cursorWordIndex.value = arCielaWordsIndex;
        cursorInWord.value = arCielaWords.value[arCielaWordsIndex].length;
      }
      if (i !== 0) {
        // 前の文字が空白ではなく、現在の文字が空白ならarrayのindexを進める
        if (
          (!chars[i - 1].match(separator) && chars[i].match(separator)) ||
          (chars[i - 1].match(separator) && !chars[i].match(separator))
        ) {
          arCielaWordsIndex++;
          arCielaWords.value[arCielaWordsIndex] = "";
        }
      }
      arCielaWords.value[arCielaWordsIndex] += chars[i];
    }
  }
);

const getArCielaWordStr = (
  char: string,
  session: number,
  envelope?: TArCielaChar["envelope"]
) => {
  let text = char;
  switch (mode.value) {
    case "compartment":
      text = getCompartmentStr(char, session, envelope);
      break;
    case "arCiela_font":
      text = geFontStr(char, session, envelope);
      break;
  }
  return text;
};
// キーボード入力
const input = ({ char, session }: { char: string; session: number }) => {
  emit("input", getArCielaWordStr(char, session));
};

// セッション・エンベロープ修正
const replace = (char: TArCielaChar) => {
  if (!char.input) return;
  // 開始位置と終了位置を取得
  let beforeText = "";
  let start = 0;
  let end = 0;
  for (let i = 0; i < arCielaWords.value.length; i++) {
    if (i === cursorWordIndex.value) {
      const cursorArCielaWord = getArCielaWord(arCielaWords.value[i]);
      for (let j = 0; j < cursorCharIndex.value; j++) {
        beforeText += cursorArCielaWord.chars[j].input ?? "";
      }
      start = beforeText.length;
      end = start + (char.input ?? "").length;
      break;
    }
    beforeText += arCielaWords.value[i];
  }
  // セッション・エンベロープを修正

  emit("replace", {
    start,
    end,
    text: getArCielaWordStr(char.char, char.session ?? 0, char.envelope),
  });
};
</script>

<style scoped>
.control {
  width: 100%;
  margin: auto;
}
.keyboard {
  box-sizing: content-box;
  width: calc(100% - 60px);
  margin: auto;
  padding-bottom: 34px;
}
</style>
