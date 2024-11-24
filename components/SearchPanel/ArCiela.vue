<template>
  <div
    v-if="keyword.length"
    class="text-xs text-right opacity-90 mt-0 leading-5"
  >
    <ULink to="/editor" class="text-blue-500">ヒュムノスエディタ</ULink
    >ではコンパートメントの編集が可能です。
  </div>
  <div v-if="keyword.length" class="mb-5">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
      style="min-height: 70px"
    >
      <div :rows="lineWords" style="display: flex; flex-wrap: wrap">
        <WordArciela
          v-for="(word, index) in line"
          :word="word"
          :key="index + word.word"
          font
        />
        <WordArciela
          :word="emptyArcielaWordData"
          :key="-1"
          style="flex: 1000 1 auto"
        />
      </div>
    </div>
  </div>
  <UAccordion multiple :items="keyword.length ? items : [items[1]]">
    <template #characters>
      <TableArCiela />
    </template>
    <template #lyrics>
      <LyricTable :lyrics="foundLyrics" :word="keyword" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { TArcielaWord } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const arciela = useArciela();
const { emptyArcielaWordData } = arciela;
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

const lineWords = computed((): TArcielaWord[][] => {
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
