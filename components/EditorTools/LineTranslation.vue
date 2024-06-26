<template>
  <div class="line-translation">
    <LanguageSelect v-model="language" />
    <div v-if="language === 'ヒュムノス'" class="line pl-4 pr-5">
      <HymmnosWord
        v-for="(word, index) in editorWords[selectedLineIndex]?.filter(
          (w) => w.hymmnos !== ' '
        )"
        :word="word"
        :key="index"
        small
      />
    </div>
    <div v-else-if="language === '律史前月読'" class="line pl-2 pr-5">
      <div
        v-for="(word, index) in editorWords[selectedLineIndex]?.filter(
          (w) => w.hymmnos !== ' '
        )"
        :key="index"
        class="text-black"
      >
        <ForelunaWord
          :word="
            getForelunaWord(word.hymmnos) ?? {
              word: word.hymmnos,
              sections: [],
              type: null,
            }
          "
          small
        />
      </div>
    </div>
    <div v-else-if="language === 'アルシエラ'" class="line pl-2 pr-5">
      <ArcielaWord
        v-for="(word, index) in editorWords[selectedLineIndex]?.filter(
          (w) => w.hymmnos !== ' '
        )"
        :word="word.hymmnos"
        :chars="getArcielaWord(word.hymmnos) ?? []"
        :key="index"
        small
      />
    </div>
    <div v-else class="line pl-2 pr-5">
      {{ editorWords[selectedLineIndex]?.map((w) => w.hymmnos).join("") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import LanguageSelect from "~/components/EditorTools/LanguageSelect.vue";
const { editorWords, selectedLineIndex } = useEditor();
const { getForelunaWord } = useForeluna();
const { getArcielaWord } = useArciela();

const language = ref("ヒュムノス");

// indexが変わったら言語をチェックする
watch(
  () => [selectedLineIndex.value],
  () => {
    // 英数字を含むワードのみ抽出
    const words = editorWords.value[selectedLineIndex.value]?.filter(
      (w) => !w.hymmnos.match(/^[^a-z]+$/)
    );

    // ワードがないならヒュムノス
    if (!words) {
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
/* 右端に白いグラデーションを表示 */
.line-translation {
  position: relative;
  display: flex;
}
.line-translation::after {
  content: "";
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
  position: absolute;
  z-index: 1;
  width: 40px;
  top: 0;
  right: 0;
  bottom: 0;
}
.line {
  display: flex;
  justify-content: start;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
/* Chrome, Safari 対応 */
.line::-webkit-scrollbar {
  display: none;
}
</style>
