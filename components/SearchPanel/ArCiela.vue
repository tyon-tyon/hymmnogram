<template>
  <div
    v-if="keyword.length"
    class="text-xs text-right opacity-90 mt-0 leading-5"
  >
    <AtomLink href="/editor">ヒュムノスエディタ</AtomLink>ではコンパートメントの編集が可能です。
  </div>
  <div v-if="keyword.length" class="mb-5">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
    >
      <div :rows="lineWords" class="flex flex-wrap">
        <WordArCiela
          v-for="(word, index) in line"
          :word="word"
          :key="index + word.word"
          class="pr-4 pt-4"
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
import type { TArCielaWord } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const arCiela = useArCiela();
const { emptyArCielaWordData } = arCiela;
const lyrics = useLyrics();
const { splitForeluna } = useTextProcessor();

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

const lineWords = computed((): TArCielaWord[][] => {
  const keyword = props.keyword;
  // 行と単語に分割
  const lines = splitForeluna(keyword);

  return lines.map((line) =>
    line.map((word) => {
      // 日本語が含まれている場合はそのまま表示
      if (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/)) {
        return {
          ...emptyArCielaWordData,
          word,
        };
      }
      // 単語に変換
      return arCiela.getArCielaWord(
        word,
        !line.join(" ").match(/[\-\!\#\$\%\&\(\'\)]/)
      );
    })
  );
});

// 用例検索
const foundLyrics = computed(() => lyrics.getMatchForeluna(props.keyword));
</script>
