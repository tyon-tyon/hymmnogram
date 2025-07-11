<template>
  <div class="line-translation relative flex flex-row p-1 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800">
    <LanguageSelect v-model="language" class="mr-2" />
    <div v-if="language === 'ヒュムノス'" class="line flex-1 pr-10 flex items-center whitespace-nowrap">
      <WordHymmnos v-for="(word, index) in hymmnosWords?.filter((w) => w.hymmnos !== ' ')" :word="word" :key="index"
        small class="mr-2" />
    </div>
    <div v-else-if="language === '律史前月読'" class="line flex-1 pl-2 pr-10 flex items-center whitespace-nowrap">
      <div v-for="(word, index) in hymmnosWords?.filter((w) => w.hymmnos !== ' ')" :key="index">
        <WordForeluna :word="getForelunaWord(word.hymmnos) ?? {
          word: word.hymmnos,
          sections: [],
          type: null,
        }
          " small class="mr-3" />
      </div>
    </div>
    <div v-else-if="language === 'アルシエラ'" class="line flex-1 pl-2 pr-10 flex items-center whitespace-nowrap">
      <WordArCiela v-for="(word, index) in arCielaWords" class="mr-3" :key="index + word"
        :word="getArCielaWord(word, !cursorLine.match(/[\-\!\#\$\%\&\(\'\)]/))" small />
    </div>
    <div v-else class="line pl-2 pr-10">
      {{hymmnosWords?.map((w) => w.hymmnos).join("") ?? ""}}
    </div>
    <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/90 dark:to-black/90"></div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelect from "~/components/EditorTools/LanguageSelect.vue";
const { editorWords, cursorLineIndex, cursorLine } = useEditor();
const { getForelunaWord } = useForeluna();
const { getArCielaWord } = useArCiela();
const { splitForeluna } = useTextProcessor();

const language = ref("ヒュムノス");

// カーソル行のヒュムノスワードを取得
const hymmnosWords = computed(() => {
  return editorWords.value[cursorLineIndex.value] ?? [];
});

// カーソル行のアルシエラワードを取得
const arCielaWords = computed(() => {
  // アルシエラは空白とカンマとピリオドで区切る
  return splitForeluna(cursorLine.value)[0];
});

// 行番号かテキストエリアの中身が変わったら言語をチェックする
watch(
  () => [cursorLine.value, cursorLineIndex.value],
  () => {
    // 英数字を含むワードのみ抽出
    const words = hymmnosWords.value?.filter(
      (w) => !w.hymmnos.match(/^[^a-z]+$/)
    ) ?? [];

    // ワードがないならヒュムノス
    if (!words || words.length === 0) {
      language.value = "ヒュムノス";
      return;
    }

    // s-[1-4]があればアルシエラ
    if (words.some((w) => w.hymmnos.match(/\[s-[0-4]/))) {
      language.value = "アルシエラ";
      return;
    }

    const dialectCount = words.filter((w) => w.dialect).length;
    if (words.length <= 2 || dialectCount >= 3) {
      // dialectが3個以上ならヒュムノス
      language.value = "ヒュムノス";
      return;
    }

    const wordsString = words.map((w) => w.hymmnos).join("");
    if (wordsString.match(/[A-Z]/)) {
      // 大文字があるなら律史前月読
      language.value = "律史前月読";
      return;
    }

    if (wordsString.match(/[a-z]/)) {
      // 英字があるなら星語
      language.value = "アルシエラ";
      return;
    }

    language.value = "ヒュムノス";
  }
);
</script>

<style>
.line-translation .line {
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Chrome, Safari 対応 */
.line-translation .line::-webkit-scrollbar {
  display: none;
}
</style>
