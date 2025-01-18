<template>
  <UTable
    :rows="lyrics.slice(0, showAll ? undefined : defaultRowCount)"
    :columns="columns"
    sortable
    :empty-state="{ icon: '', label: '用例が見つかりません...' }"
    :ui="{
      th: {
        padding: 'hidden',
      },
    }"
  >
    <template #example-data="{ row }">
      <div class="text-wrap mb-2" v-html="getLyricHtml(row.lyric)"></div>
      <div class="text-wrap text-xs leading-4">
        <span v-html="getJapaneseHtml(row)"></span> - {{ row.title }}
      </div>
    </template>
  </UTable>
  <UButton
    v-if="lyrics.length > defaultRowCount && !showAll"
    @click="showAll = !showAll"
    class="w-full"
    color="primary"
    variant="link"
    size="xl"
    block
  >
    全て表示({{ lyrics.length }}件)
  </UButton>
</template>

<script setup lang="ts">
import type { TLyric } from "~/types";
const props = withDefaults(
  defineProps<{
    word: string;
    lyrics: TLyric[];
    defaultRowCount?: number;
  }>(),
  {
    defaultRowCount: 10,
  }
);
const { lyrics } = toRefs(props);
const dictionary = useDictionary();

const columns = [
  {
    key: "example",
    label: "用例",
    class: "bold",
  },
];

const showAll = ref<boolean>(false);

watch(
  () => props.lyrics,
  () => {
    showAll.value = false;
  }
);

const getHilightedText = (text: string, hilighted: string) => {
  return text.replace(
    new RegExp("(" + hilighted + ")", "gi"),
    `<span class="font-bold text-primary-600">$1</span>`
  );
};

// HTMLデータ
const getJapaneseHtml = (lyric: TLyric) => {
  const { word } = props;
  if (!word || word.match(/[:]/)) return lyric.japanese;

  // word.hymmnosと一致する部分をハイライト
  const standart = getHilightedText(lyric.japanese, word);
  if (standart !== lyric.japanese) {
    return standart;
  }

  // 変化がある場合
  const match = lyric.japaneseWords.match(
    new RegExp(word + "[^:]*:([^: ]+)", "gi")
  );
  if (!match) return lyric.japanese;
  const hilighted = match[0].replace(/[^:]*:([^: ]+)/, "$1");
  return getHilightedText(lyric.japanese, hilighted);
};

// HTMLデータ
const getLyricHtml = (lyric: string) => {
  const { word } = props;
  if (!word) return lyric;

  // word.hymmnosと一致する部分をハイライト
  const standart = lyric.replace(
    new RegExp(
      "(" + (word.replace(/([\.\-])/g, "\\$1") ?? "") + ")",
      "gi"
    ),
    `<span class="font-bold text-primary-600">$1</span>`
  );
  if (standart !== lyric) {
    return standart;
  }

  // 変化がある場合
  const words = dictionary.splitHymmnos(lyric);
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
        w.hymmnos === word ||
        (w.subWords && w.subWords[0].hymmnos === word)
      ) {
        return `<span class="font-bold text-primary-600">${w.hymmnos}</span>`;
      }
      return w.hymmnos;
    })
    .join("");
};
</script>
