<template>
  <div class="base">
    <h1>歌詞動画の静止画作成用ページ</h1>
    <div class="flex flex-col">
      <div class="view-area">
        <div class="flex flex-col line justify-center" v-for="(lyric, index) in lyrics">
          <template v-if="lyric.hymmnos[0] && lyric.hymmnos[0].hymmnos !== ''">
            <div class="flex flex-row flex-wrap mb-2">
              <WordHymmnos v-for="(word, wordIndex) in lyric.hymmnos" :word lyric
                class="mr-3 mb-2 hymmnos-japanese" @click="openChangeWordDialog(index, wordIndex)" />
            </div>
            <p class="hymmnos-japanese text-cool-400 whitespace-pre-wrap">{{ lyric.japanese }}</p>
          </template>
          <template v-else>
            <p class="japanese text-lg text-cool-500 whitespace-pre-wrap">{{ lyric.japanese }}</p>
          </template>
        </div>
      </div>
      <div>
        <h2>歌詞データ入力</h2>
        <div class="flex flex-row flex-wrap">
          <template v-for="(lyrics, index) in lyricsText">
            <UTextarea class="w-1/2" v-model="lyricsText[index]" @update:modelValue="updateLyrics" :rows="2" />
          </template>
        </div>
      </div>
    </div>
    <!-- 単語の意味変更ダイアログ -->
    <UModal v-model="isOpen" title="単語の意味変更ダイアログ" @close="isOpen = false">
      <div class="flex flex-row flex-wrap">
        <UButton v-for="japanese in lyrics[changeLineIndex].hymmnos[changeWordIndex].japanese" :key="japanese"
          @click="closeChangeWordDialog(japanese)">
          {{ japanese }}
        </UButton>
      </div>
      <div class="flex flex-row flex-wrap">
        <UInput v-model="dialogJapanese"/>
        <UButton @click="closeChangeWordDialog(dialogJapanese)">保存</UButton>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TWord } from '~/types';

const dictionary = useDictionary();
// { hymmnos: "", japanese: "" }を４つ持たせる
const lyricsText = ref([
  "", "", "", ""
]);

const lyrics = ref<{ hymmnos: TWord[]; japanese: string; }[]>([
  { hymmnos: [], japanese: "" },
  { hymmnos: [], japanese: "" },
  { hymmnos: [], japanese: "" },
  { hymmnos: [], japanese: "" },
]);

const updateLyrics = () => {
  const newVal = lyricsText.value;
  // 1個目の改行で分割
  const lyricsHymJa = newVal.map(lyrics => {
    const lines = lyrics.split(/\n/);
    // 0行目に日本語があったら日本語のみ
    if (!lines[0].match(/^[a-zA-Z]/)) {
      return { hymmnos: "", japanese: lyrics };
    }
    return { hymmnos: lines[0], japanese: lyrics.replace(lines[0], "").replace(/^\n*/, "") };
  });
  lyrics.value = [
    { hymmnos: dictionary.getWords(lyricsHymJa[0].hymmnos)[0].map(w => adjustHymmnos(w)), japanese: lyricsHymJa[0].japanese },
    { hymmnos: dictionary.getWords(lyricsHymJa[1].hymmnos)[0].map(w => adjustHymmnos(w)), japanese: lyricsHymJa[1].japanese },
    { hymmnos: dictionary.getWords(lyricsHymJa[2].hymmnos)[0].map(w => adjustHymmnos(w)), japanese: lyricsHymJa[2].japanese },
    { hymmnos: dictionary.getWords(lyricsHymJa[3].hymmnos)[0].map(w => adjustHymmnos(w)), japanese: lyricsHymJa[3].japanese },
  ];
};

const isOpen = ref(false);
const changeLineIndex = ref(0);
const changeWordIndex = ref(0);
const dialogJapanese = ref("");

const openChangeWordDialog = (lineIndex: number, wordIndex: number) => {
  changeLineIndex.value = lineIndex;
  changeWordIndex.value = wordIndex;
  isOpen.value = true;
};

const closeChangeWordDialog = (text: string) => {
  console.log(text);
  lyrics.value[changeLineIndex.value].hymmnos[changeWordIndex.value].primaryMeaning = text;
  lyrics.value = [...lyrics.value];
  isOpen.value = false;
};


const adjustHymmnos = (word: TWord): TWord => {
  if (word.hymmnos.match(/^was$/i)) {
    return {
      ...word,
      primaryMeaning: "とても",
    };
  }
  if (word.hymmnos.match(/^ra$/i)) {
    return {
      ...word,
      primaryMeaning: "このままで",
    };
  }
  if (word.hymmnos.match(/^ga$/i)) {
    return {
      ...word,
      primaryMeaning: "脱したい",
    };
  }
  if (word.hymmnos.match(/^ks$/i)) {
    return {
      ...word,
      primaryMeaning: "かける",
    };
  }
  if (word.hymmnos.match(/^whai$/i)) {
    return {
      ...word,
      primaryMeaning: "なぜ",
    };
  }
  if (word.hymmnos.match(/^enter$/i)) {
    return {
      ...word,
      primaryMeaning: "入る",
    };
  }
  if (word.primaryMeaning?.match(/（主語定義）/)) {
    return {
      ...word,
      primaryMeaning: word.primaryMeaning.replace(/（主語定義）/, ""),
    };
  }
  if (word.primaryMeaning?.match(/^〜に/)) {
    return {
      ...word,
      primaryMeaning: word.primaryMeaning.replace(/^〜に/, ""),
    };
  }
  if (word.dialect === "unknown") {
    return {
      ...word,
      primaryMeaning: word.primaryMeaning + "?",
    };
  }
  return word;
};
</script>

<style scoped>
.base {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(1.5);
  transform-origin: top center;
}

.view-area {
  width: calc(1600px * 0.5);
  height: calc(900px * 0.5);
  background-color: #fff;
  transform-origin: top left;
  box-sizing: border-box;
  padding: 10px;
  overflow: hidden;
}


.line {
  min-height: 25%;
}
</style>
