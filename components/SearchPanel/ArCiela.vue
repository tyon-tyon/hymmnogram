<template>
  <div v-if="lineWords.length" class="mb-5">
    <div
      v-for="(line, index) in lineWords"
      :key="index"
      style="min-height: 70px"
    >
      <div :rows="lineWords" style="display: flex; flex-wrap: wrap">
        <ArcielaWord
          v-for="(word, index) in line"
          :word="word"
          :key="index"
          font
        />
        <ArcielaWord :word="emptyArcielaWordData" style="flex: 1000 1 auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TArcielaCharData, TArcielaWordData } from "~/types";

const props = defineProps<{
  keyword: string;
}>();

const arciela = useArciela();
const { emptyArcielaWordData, emptyArcielaCharData } = arciela;
const example = useExample();
const { splitArCiela } = useTextProcessor();

const lineWords = computed((): TArcielaWordData[][] => {
  const keyword = props.keyword;
  // ヒュムノスの文章の意味を調べる
  if (keyword.match(/([\!\?\s,]|\/.)/)) {
    // 行と単語に分割
    const lines = splitArCiela(keyword);

    console.log(lines);
    return lines.map((line) =>
      line.map((word) => {
        // 日本語が含まれている場合はそのまま表示
        if (word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/)) {
          return {
            ...emptyArcielaWordData,
            word,
          };
        }
        // 単語検索
        return arciela.getArcielaWord(
          word,
          !line.join(" ").match(/[\-\!\#\$\%\&\(\'\)]/)
        );
      })
    );
  }
  return [];
});
</script>
