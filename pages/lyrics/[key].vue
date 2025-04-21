<template>
  <Layout :breadcrumb-links="breadcrumbLinks">
    <AtomH2>{{ music?.title }}</AtomH2>
    <div class="md:grid md:grid-cols-[2fr_1fr] md:gap-4">
      <div v-if="music" class="order-1 md:order-2">
        <AtomH3 class="hidden md:block">楽曲情報</AtomH3>
        <UAlert v-if="music.notice" icon="i-heroicons-exclamation-circle" class="text-sm mb-4" :description="music.notice" />
        <AtomP class="text-sm">
          歌唱：{{ music.singer.join(', ') }}<br>
          作詞：{{ music.lyricist.join(', ') }}<br>
          作曲：{{ music.composer.join(', ') }}<br>
          編曲：{{ music.arranger.join(', ') }}<br>
          リリース：{{ music.releaseDate }}
        </AtomP>
        <div class="flex flex-wrap mb-4">
          <AtomLink v-for="tag in tags" :key="tag" :href="`/lyrics/?tag=${tag}`" class="text-sm mr-2">
            #{{ tag }}
          </AtomLink>
        </div>
        <UAccordion class="mb-4" multiple :items="items">
          <template #explanation>
            <AtomP class="whitespace-pre-wrap text-sm">
              {{ music.explanation }}
            </AtomP>
          </template>
          <template #feeling>
            <AtomP class="text-sm">
              <p v-for="line in music.feeling.split('\n')" :key="line" class="mb-2">
                {{ line }}
              </p>
            </AtomP>
          </template>
        </UAccordion>
      </div>
      <div class="order-2 md:order-1">
        <div v-for="lyric in lyrics" :key="lyric.id" class="pb-8" :id="`lyric-${lyric.id}`">
          <AtomChipButton v-if="lyric.unofficial?.lyric" @click="openUnofficialDialog(lyric)">
            非公式
          </AtomChipButton>
          <AtomChipButton v-if="lyric.correctionLyric" @click="openCorrectionDialog(lyric)">
            修正版
          </AtomChipButton>
          <div v-if="lyric.lyric" class="flex flex-wrap ">
            <WordHymmnos v-for="(word, index) in getLyricWords(lyric.correctionLyric ?? lyric.lyric)" :word="word"
              :key="index" small class="mr-2 cursor-pointer" @click="openWordDialog(word)" />
          </div>
          <p v-if="lyric.lyric" class="text-sm text-cool-500 mt-1">{{ lyric.japanese }}</p>
          <p v-else><span v-html="getJapaneseRuby(lyric.japaneseRuby ?? lyric.japanese ?? '')"></span></p>
        </div>
      </div>
    </div>
    <AtomModal v-model:visible="isUnofficialDialogOpen" title="非公式タグについて">
      <p class="p-2 text-sm text-cool-500">
        公式の歌詞カードにない歌詞です。<br />
        歌詞カードにないだけで、公式から言及されている可能性があります。<br />
        有志による推測によるものは、間違いがある可能性があります。
      </p>
    </AtomModal>
    <AtomModal v-model:visible="isCorrectionDialogOpen" title="修正前の歌詞">
      <div v-if="dialogLyric" class="mb-4">
        <div v-if="dialogLyric.correctionLyric" class="flex flex-wrap ">
          <WordHymmnos v-for="(word, index) in getLyricWords(dialogLyric.lyric ?? '')" :word="word" :key="index" small
            class="mr-2 cursor-pointer" @click="openWordDialog(word)" />
        </div>
      </div>
      <p class="text-sm text-cool-500">
        通常表示されているものは公式の歌詞カードに書かれている歌詞の誤字を修正したものです。<br />
        有志による推測によるもののため、間違いがある可能性があります。
      </p>
    </AtomModal>
  </Layout>
</template>

<script setup lang="ts">
import type { TLyric, TWord } from '@/types';

const items = [
  {
    label: "解説",
    slot: "explanation",
    defaultOpen: false,
  },
  {
    label: "詩の想い",
    slot: "feeling",
    defaultOpen: false,
  },
];

const isUnofficialDialogOpen = ref(false);
const isCorrectionDialogOpen = ref(false);
const isWordDialogOpen = ref(false);
const dialogLyric = ref<TLyric | null>(null);
const dialogWord = ref<TWord | null>(null);

const { getWords } = useDictionary();
const { getFromMusicKey } = useLyrics();
// SSRでidを取得
const key = useRoute().params.key;
const { lyrics, music } = getFromMusicKey(key as string);

if (!music) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Music not found',
  });
}

const breadcrumbLinks = [
  {
    label: 'ヒュムノス歌詞一覧',
    to: '/lyrics',
  },
  {
    label: music.title,
    to: `/lyrics/${key}`,
  },
];

// OGタグを設定
useHead({
  title: music?.title,
  meta: [
    { property: 'og:title', content: music.title },
    { property: 'og:url', content: `${window.location.origin}/lyrics/${key}` },
    { property: 'og:description', content: `${music.title}の歌詞` },
  ],
});

//　タグを設定
const tags = [...music.tags, ...music.singer, ...music.lyricist, ...music.composer, ...music.arranger].filter((tag, index, self) => self.indexOf(tag) === index);

// データを表示
const getLyricWords = (hymmnos: string) => {
  return getWords(hymmnos)[0];
};

const getJapaneseRuby = (japaneseRuby: string) => {
  return japaneseRuby.replace(/\[(.*?)\]\((.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>').replace(/\s/g, '　');
};

const openUnofficialDialog = (lyric: TLyric) => {
  dialogLyric.value = lyric;
  isUnofficialDialogOpen.value = true;
};

const openCorrectionDialog = (lyric: TLyric) => {
  dialogLyric.value = lyric;
  isCorrectionDialogOpen.value = true;
};

const openWordDialog = (word: TWord) => {
  dialogWord.value = word;
  isWordDialogOpen.value = true;
};
</script>
