<template>
  <UTable :rows="lyrics.slice(0, showAll ? undefined : defaultRowCount)" :columns="columns" sortable
    :empty-state="{ icon: '', label: '用例が見つかりません...' }" :ui="{
      th: {
        padding: 'hidden',
      },
    }">
    <template #example-data="{ row }">
      <div class="mb-2 text-base">
        <div class="text-wrap" :class="row.unofficial?.lyric ? 'text-cool-400' : ''">
          <UButton v-if="row.unofficial?.lyric" label="非公式" size="xs" variant="outline"
            class="text-cool-400 py-1 px-2 mr-1" @click="isOpenUnofficial = true" /><span
            v-html="getLyricHtml(row.lyric)"></span>
        </div>
        <div v-if="row.correction" class="text-wrap mt-1 mb-2 text-cool-400">
          <UButton label="修正版" size="xs" variant="outline" class="text-cool-400 py-1 px-2 mr-1"
            @click="isOpenCorrection = true" /><span v-html="getLyricHtml(row.correction)"></span>
        </div>
      </div>
      <div class="text-wrap text-sm leading-4" :class="row.unofficial?.lyric ? 'text-cool-400' : ''">
        <UButton v-if="row.unofficial?.lyric" label="非公式" size="xs" variant="outline"
          class="text-cool-400 py-1 px-2 mr-1" @click="isOpenUnofficial = true" /><span
          v-html="getJapaneseHtml(row)"></span> - {{ row.title }}
      </div>
    </template>
  </UTable>
  <UButton v-if="lyrics.length > defaultRowCount && !showAll" @click="showAll = !showAll" class="w-full" color="primary"
    variant="link" size="xl" block>
    全て表示({{ lyrics.length }}件)
  </UButton>
  <UModal v-model="isOpenUnofficial">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            非公式タグについて
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpenUnofficial = false" />
        </div>
      </template>
      <p class="p-2 text-sm text-gray-500">
        公式の歌詞カードにない歌詞です。<br />
        有志による推測によるもののため、間違いがある可能性があります。
      </p>
    </UCard>
  </UModal>
  <UModal v-model="isOpenCorrection">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            修正版について
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="isOpenUnofficial = false" />
        </div>
      </template>
      <p class="p-2 text-sm text-gray-500">
        公式の歌詞カードに書かれている歌詞の誤字を修正したものです。<br />
        有志による推測によるもののため、間違いがある可能性があります。
      </p>
    </UCard>
  </UModal>
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
const isOpenUnofficial = ref<boolean>(false);
const isOpenCorrection = ref<boolean>(false);

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
