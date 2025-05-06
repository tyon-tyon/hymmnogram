<template>
  <Layout :breadcrumb-links="breadcrumbLinks">
    <AtomH2>
      <div class="flex items-center justify-between gap-2">
        {{ music?.title }}
        <UButton @click="openShareDialog()" color="white" variant="ghost" size="sm" icon="i-heroicons-share" />
      </div>
    </AtomH2>
    <div class="md:grid md:grid-cols-[2fr_1fr] md:gap-4">
      <div v-if="music" class="order-1 md:order-2">
        <AtomH3 class="hidden md:block">楽曲情報</AtomH3>
        <UAlert v-if="music.notice" icon="i-heroicons-exclamation-circle" class="text-sm mb-4"
          :description="music.notice" />
        <AtomP class="text-sm">
          歌唱：{{ music.singer.join(', ') }}<br>
          作詞：{{ music.lyricist.join(', ') }}<br>
          作曲：{{ music.composer.join(', ') }}<br>
          編曲：{{ music.arranger.join(', ') }}
        </AtomP>
        <div class="flex flex-wrap mb-4">
          <AtomLink v-for="tag in tags" :key="tag" :href="`/lyrics/?tag=${encodeURIComponent(tag)}`" class="text-sm mr-2">
            #{{ tag }}
          </AtomLink>
        </div>
        <ClientOnly>
          <UAccordion class="mb-4" multiple :items="items" :ui="{ wrapper: 'w-full flex flex-col' }">
            <template #explanation>
              <AtomP class="whitespace-pre-wrap text-sm">
                {{ music.explanation ?? "" }}
              </AtomP>
            </template>
            <template #feeling>
              <AtomP class="text-sm">
                <p v-for="line in music.feeling?.split('\n') ?? []" :key="line" class="mb-2">
                  {{ line }}
                </p>
              </AtomP>
            </template>
          </UAccordion>
        </ClientOnly>
      </div>
      <div class="order-2 md:order-1">
        <div v-for="lyric in lyrics" :key="lyric.id" :id="`lyric-${lyric.id}`"
          class="hover:bg-cool-50 dark:hover:bg-cool-900 relative line mb-8">
          <!-- タグ表示 -->
          <div class="flex flex-wrap gap-2">
            <AtomChipButton v-if="lyric.unperformed">
              未歌唱
            </AtomChipButton>
            <AtomChipButton v-if="lyric.unofficial?.lyric || lyric.unofficial?.japanese"
              @click="openUnofficialDialog(lyric)">
              非公式
            </AtomChipButton>
            <AtomChipButton v-if="lyric.correction?.lyric || lyric.correction?.japanese"
              @click="openCorrectionDialog(lyric)">
              修正版
            </AtomChipButton>
          </div>

          <!-- ヒュムノス歌詞 -->
          <div v-if="lyric.lyric" :class="{ 'opacity-50': lyric.unperformed }">
            <!-- ヒュムノス語 -->
            <div class="flex flex-wrap">
              <WordHymmnos v-for="(word, index) in getLyricWords(lyric.correction?.lyric ?? lyric.lyric ?? '')"
                :word="word" :key="index" small class="mr-2 cursor-pointer" @click="openWordDialog(word)" />
            </div>
            <!-- 日本語 -->
            <AtomP class="text-sm text-cool-500 mt-1">
              <span v-html="getJapaneseRuby(lyric.correction?.japanese ?? lyric.japanese ?? '')"></span>
            </AtomP>
          </div>

          <!-- 日本語歌詞 -->
          <div v-else-if="lyric.japanese" :class="{ 'opacity-50': lyric.unperformed }">
            <AtomP>
              <span v-html="getJapaneseRuby(lyric.correction?.japaneseRuby ?? lyric.japaneseRuby ?? '')"></span>
            </AtomP>
          </div>


          <UButton v-if="lyric.lyric || lyric.japanese" size="sm" color="white" icon="i-heroicons-share" variant="ghost"
            class="line-share p-0 absolute bottom-0 right-0 opacity-50" @click="openShareDialog(lyric)" />
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
        <!-- ヒュムノス歌詞 -->
        <div v-if="dialogLyric.lyric">
          <div class="flex flex-wrap">
            <WordHymmnos v-for="(word, index) in getLyricWords(dialogLyric.lyric)" :word="word" :key="index" small
              class="mr-2 cursor-pointer" @click="openWordDialog(word)" />
          </div>
          <AtomP class="text-sm text-cool-500 mt-1">
            <span v-html="getJapaneseRuby(dialogLyric.japanese ?? '')"></span>
          </AtomP>
        </div>
        <!-- 日本語歌詞 -->
        <div v-else-if="dialogLyric.japanese">
          <AtomP>
            <span v-html="getJapaneseRuby(dialogLyric.japaneseRuby ?? '')"></span>
          </AtomP>
        </div>
      </div>
      <p class="text-sm text-cool-500">
        通常表示されているものは公式の歌詞カードに書かれている歌詞の誤字を修正したものです。<br />
        有志による推測によるもののため、間違いがある可能性があります。
      </p>
    </AtomModal>
    <ShareDialog :text="shareText" :url="shareUrl" v-model:visible="isShareDialogOpen" />
  </Layout>
</template>

<script setup lang="ts">
import type { TLyric, TWord } from '@/types';

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

const items = [
  ...(music.explanation ? [{
    label: "解説",
    slot: "explanation",
    defaultOpen: false,
  }
  ] : []),
  ...(music.feeling ? [{
    label: "詩の想い",
    slot: "feeling",
    defaultOpen: false,
  }] : []),
];

const breadcrumbLinks = [
  {
    label: '歌詞一覧',
    to: '/lyrics',
  },
  {
    label: music.title,
    to: `/lyrics/${key}`,
  },
];

// OGタグを設定
useHead({
  title: "[歌詞]" + music?.title,
  meta: [
    { property: 'og:title', content: "[歌詞]" + music.title },
    { property: 'og:url', content: `/lyrics/${key}` },
    { property: 'og:description', content: `${music.title}の歌詞と単語の意味です` },
  ],
});

const isUnofficialDialogOpen = ref(false);
const isCorrectionDialogOpen = ref(false);
const isWordDialogOpen = ref(false);
const isShareDialogOpen = ref(false);

const dialogLyric = ref<TLyric | null>(null);
const dialogWord = ref<TWord | null>(null);
const shareText = ref('');
const shareUrl = computed(() => {
  return `/lyrics/${key}`;
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

const openShareDialog = (lyric?: TLyric) => {
  if (!lyric) {
    shareText.value = music?.title;
  } else {
    const lyricText = (lyric.correction?.lyric ?? lyric.lyric ?? "") + (lyric.correction?.lyric || lyric.lyric ? "\n" : "");

    shareText.value =
      `${lyricText}${lyric.japanese ?? ""} - ${music?.title}`;
  }
  isShareDialogOpen.value = true;
};
</script>

<style scoped>
.line .line-share {
  display: none;
}

.line:hover .line-share {
  display: block;
}
</style>
