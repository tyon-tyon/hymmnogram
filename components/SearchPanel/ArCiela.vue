<template>
  <div class="mb-5">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
      style="min-height: 70px"
    >
      <div :rows="lineWords" style="display: flex; flex-wrap: wrap">
        <ArcielaWord
          v-for="(word, index) in line"
          :word="word"
          :key="index+word.word"
          font
        />
        <ArcielaWord
          :word="emptyArcielaWordData"
          :key="-1"
          style="flex: 1000 1 auto"
        />
      </div>
    </div>
  </div>
  <UAccordion multiple :items="!lineWords.length ? items : [items[1]]">
    <template #lyrics>
      <LyricTable :lyrics="foundLyrics" :word="keyword" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { TArcielaWordData } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const arciela = useArciela();
const { emptyArcielaWordData } = arciela;
const lyrics = useLyrics();
const { splitArCiela } = useTextProcessor();

const items = [
  {
    label: "各文字の意味",
    slot: "characters",
    defaultOpen: true,
  },
  {
    label: "用例",
    slot: "lyrics",
    defaultOpen: true,
  },
];

const lineWords = computed((): TArcielaWordData[][] => {
  const keyword = props.keyword;
  // 行と単語に分割
  const lines = splitArCiela(keyword);

  return lines.map((line) =>
    line.map((word) => {
      // 日本語が含まれている場合はそのまま表示
      if (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/)) {
        return {
          ...emptyArcielaWordData,
          word,
        };
      }
      // 単語に変換
      return arciela.getArcielaWord(
        word,
        !line.join(" ").match(/[\-\!\#\$\%\&\(\'\)]/)
      );
    })
  );
});

// 用例検索
const foundLyrics = computed(() => lyrics.getMatchForeluna(props.keyword));
</script>
