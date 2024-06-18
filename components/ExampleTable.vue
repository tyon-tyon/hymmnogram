<template>
  <UTable
    :rows="examples"
    :columns="columns"
    sortable
    :empty-state="{ icon: null, label: '用例が見つかりません...' }"
  >
    <template #example-data="{ row }">
      <div
        class="text-wrap mb-2"
        v-html="getHilightedHymmnosHtml(row.hymmnos, word)"
      ></div>
      <div class="text-wrap text-xs leading-4">{{ row.japanese }} - {{ row.title }}</div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { TWordData, TJsonExampleData } from "~/types";
const { examples } = defineProps<{
  word?: TWordData;
  examples: TJsonExampleData[];
}>();

const { splitTextIntoLinesAndWords } = useTextProcessor();
const dictionary = useDictionary();

const columns = [
  {
    key: "example",
    label: "用例",
    class: "bold",
  },
];

// HTMLデータ
const getHilightedHymmnosHtml = (hymmnos: string, word?: TWordData) => {
  if (!word) return hymmnos;

  // word.hymmnosと一致する部分をハイライト
  const standart = hymmnos.replace(
    new RegExp(
      "(" + (word?.hymmnos.replace(/([\.\-])/g, "\\$1") ?? "") + ")",
      "gi"
    ),
    `<span class="font-bold text-primary-600">$1</span>`
  );
  if (standart !== hymmnos) {
    return standart;
  }

  // 変化がある場合
  const words = splitTextIntoLinesAndWords(hymmnos)[0];
  const found = words.map((word) => {
    const found = dictionary.getExactMatch(word);
    return found
      ? { ...found, hymmnos: word }
      : { ...dictionary.emptyWordData, hymmnos: word };
  });

  return found
    .map((w) => {
      // ハイライト
      if (
        w.hymmnos === word.hymmnos ||
        (w.subWords && w.subWords[0].hymmnos === word.hymmnos)
      ) {
        return `<span class="font-bold text-primary-600">${w.hymmnos}</span>`;
      }
      return w.hymmnos;
    })
    .join("");
};
</script>
