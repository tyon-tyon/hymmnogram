<template>
  <div v-if="keyword.length" class="mb-5">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
      style="min-height: 70px"
    >
      <div :rows="lineWords" style="display: flex; flex-wrap: wrap">
        <WordForeluna
          v-for="(word, index) in line"
          :word="word"
          :key="index + word.word"
          font
        />
        <WordForeluna
          :word="emptyForelunaWordData"
          :key="-1"
          style="flex: 1000 1 auto"
        />
      </div>
    </div>
  </div>
  <UAccordion multiple :items="keyword.length ? items : [items[1]]">
    <template #characters>
      <ForelunaTables />
    </template>
    <template #lyrics>
      <LyricTable :lyrics="foundLyrics" :word="keyword" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { TForelunaWord } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const foreluna = useForeluna();
const { emptyForelunaWordData } = foreluna;
const lyrics = useLyrics();
const { splitArCiela } = useTextProcessor();

const items = [
  {
    label: "用例",
    slot: "lyrics",
    defaultOpen: true,
  },
  {
    label: "各文字の意味",
    slot: "characters",
    defaultOpen: true,
  },
];

const lineWords = computed((): TForelunaWord[][] => {
  const keyword = props.keyword;
  // 行と単語に分割
  const lines = splitArCiela(keyword);

  return lines.map((line) =>
    line.map((word) => {
      // 日本語が含まれている場合はそのまま表示
      if (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/)) {
        return {
          ...emptyForelunaWordData,
          word,
        };
      }
      // 単語に変換
      return foreluna.getForelunaWord(word);
    })
  );
});

// 用例検索
const foundLyrics = computed(() => lyrics.getMatchForeluna(props.keyword));
</script>
