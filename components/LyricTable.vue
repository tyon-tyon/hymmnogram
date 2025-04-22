<template>
  <UTable :rows="rows" :columns="columns" sortable :empty-state="{ icon: '', label: '用例が見つかりません...' }" :ui="{
    th: {
      padding: 'hidden',
    },
    td: {
      padding: 'px-0',
    },
  }">
    <template #example-data="{ row }">
      <div class="mb-2 text-base">
        <div class="text-wrap" :class="row.unofficial?.lyric ? 'text-cool-400' : ''">
          <AtomChipButton v-if="row.unofficial?.lyric" @click="isOpenUnofficial = true" class="mr-1">
            非公式
          </AtomChipButton>
          <span v-html="getLyricHtml(row.lyric)"></span>
        </div>
        <div v-if="row.correctionLyric" class="text-wrap mt-1 mb-2 text-cool-400">
          <AtomChipButton @click="isOpenCorrection = true" class="mr-1">
            修正版
          </AtomChipButton>
          <span v-html="getLyricHtml(row.correctionLyric)"></span>
        </div>
      </div>
      <div class="text-wrap text-sm leading-4" :class="row.unofficial?.lyric ? 'text-cool-400' : ''">
        <AtomChipButton v-if="row.unofficial?.lyric" @click="isOpenUnofficial = true" class="mr-1">
          非公式
        </AtomChipButton>
        <span v-html="getJapaneseHtml(row)"></span> -
        <AtomLink v-if="row.musicKey" :href="`/lyrics/${row.musicKey}#lyric-${row.id}`">{{ row.title }}</AtomLink>
        <span v-else>{{ row.title }}</span>
      </div>
    </template>
  </UTable>
  <UButton v-if="lyrics.length > defaultRowCount && !showAll" @click="showAll = !showAll" class="w-full" color="primary"
    variant="link" size="xl" block>
    全て表示({{ lyrics.length }}件)
  </UButton>
  <AtomModal v-model:visible="isOpenUnofficial" title="非公式タグについて">
    <p class="p-2 text-sm text-cool-500">
      公式の歌詞カードにない歌詞です。<br />
      歌詞カードにないだけで、公式から言及されている可能性があります。<br />
      有志による推測によるものは、間違いがある可能性があります。
    </p>
  </AtomModal>
  <AtomModal v-model:visible="isOpenCorrection" title="修正版について">
    <p class="p-2 text-sm text-cool-500">
      公式の歌詞カードに書かれている歌詞の誤字を修正したものです。<br />
      有志による推測によるもののため、間違いがある可能性があります。
    </p>
  </AtomModal>
</template>

<script setup lang="ts">
import type { TLyric, TWord } from "~/types";
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

const rows = computed(() => {
  return showAll.value ? props.lyrics : props.lyrics.slice(0, props.defaultRowCount);
});

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
  if (!lyric) return '';
  const { word } = props;
  if (!word || word.match(/[:]/)) return lyric.japanese;

  // word.hymmnosと一致する部分をハイライト
  const standart = getHilightedText(lyric.japanese ?? '', word);
  if (standart !== lyric.japanese) {
    return standart;
  }

  // 変化がある場合
  const match = lyric.japaneseWords?.match(
    new RegExp(word + "[^:]*:([^: ]+)", "gi")
  );
  if (!match) return lyric.japanese;
  const hilighted = match[0].replace(/[^:]*:([^: ]+)/, "$1");
  return getHilightedText(lyric.japanese, hilighted);
};

// HTMLデータ
const getLyricHtml = (lyric: string) => {
  if (!lyric) return '';
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
  }) as TWord[];

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
