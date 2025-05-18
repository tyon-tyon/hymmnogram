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
          <AtomLink v-for="tag in tags" :key="tag" :href="`/lyrics/?tag=${encodeURIComponent(tag)}`"
            class="text-sm mr-2">
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
        <div v-for="lyric in lyrics" :key="lyric.id" :id="`lyric-${lyric.id}`" class="relative line mb-4"
          :class="{ 'hover:bg-cool-50 dark:hover:bg-cool-900': lyric?.lyric || lyric?.japanese }">
          <span v-if="!lyric?.lyric && !lyric?.japanese">&nbsp;</span>
          <!-- タグ表示 -->
          <div class="flex flex-wrap gap-2 items-center">
            <div v-if="lyric.part && part(lyric.part)" :class="'text-xs ' + part(lyric.part)?.class">
              {{ part(lyric.part)?.name }}
            </div>
            <AtomChipButton v-if="lyric.unperformed">
              未歌唱
            </AtomChipButton>
            <AtomChipButton v-if="lyric.unofficial?.lyric || lyric.unofficial?.japanese"
              @click="openUnofficialDialog(lyric)">
              非公式{{ lyric.unofficial?.lyric ? "歌詞" : "和訳" }}
            </AtomChipButton>
            <AtomChipButton v-if="lyric.correction?.lyric || lyric.correction?.japanese"
              @click="openCorrectionDialog(lyric)">
              修正版
            </AtomChipButton>
          </div>

          <!-- ヒュムノス歌詞 -->
          <div v-if="lyric.lyric" :class="{ 'opacity-70': lyric.sub, 'opacity-40': lyric.unperformed }">
            <!-- ヒュムノス語 -->
            <div class="flex flex-wrap">
              <WordHymmnos v-for="(word, index) in getLyricWords(lyric.correction?.lyric ?? lyric.lyric ?? '')"
                :word="word" :key="index" small pronunciation class="mr-2 cursor-pointer"
                @click="openWordDialog(word)" />
            </div>
            <!-- 日本語 -->
            <AtomP class="text-sm text-cool-500 mt-1">
              <span v-html="getJapaneseRuby(lyric.correction?.japanese ?? lyric.japanese ?? '')"></span>
            </AtomP>
          </div>

          <!-- 日本語歌詞 -->
          <div v-else-if="lyric.japanese" :class="{ 'opacity-70': lyric.sub, 'opacity-40': lyric.unperformed }">
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
import { useRoute } from 'vue-router';
import { allLyrics, musics } from '~/composables/useLyrics';

const route = useRoute();
const key = route.params.key as string;
const music = musics.find((music) => music.key === key);
if (!music) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Music not found',
  });
}
const lyrics = allLyrics.filter(lyric => lyric.musicId === music.id);

definePageMeta({
  ssr: true,
  generateStaticParams: () => {
    return musics.map(music => ({
      key: music.key
    }));
  }
});

const title = "[歌詞]" + music?.title;
const description = `${title}の歌詞と発音（カタカナ）、および単語の意味です。 ` + (lyrics.map(lyric => lyric.lyric || lyric.japanese).join(' '));
// OGタグを設定
useHead({
  title: title,
  meta: [
    { name: "description", content: description },
    { property: 'og:title', content: title },
    { property: 'og:url', content: `/lyrics/${key}` },
    { property: 'og:description', content: description },
  ],
  link: [
    { rel: 'canonical', href: `https://hymmnogram.fau-varda.net/lyrics/${key}` },
  ],
});


const { getWords } = useDictionary();

const items = ref<any[]>([]);

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

const part = (part: number) => {
  return music.parts?.[part - 1];
};

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

onMounted(() => {
  // ウィンドウ幅が640px以上の場合はデフォルトで開く
  items.value = [
    ...(music.explanation ? [{
      label: "解説",
      slot: "explanation",
      defaultOpen: window.innerWidth >= 768,
    }
    ] : []),
    ...(music.feeling ? [{
      label: "詩の想い",
      slot: "feeling",
      defaultOpen: window.innerWidth >= 768,
    }] : []),
  ];
});

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
