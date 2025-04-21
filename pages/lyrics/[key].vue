  <template>
    <Layout>
      <h1 class="text-2xl font-bold">{{ music?.title }}</h1>
      <div class="pt-4 md:grid md:grid-cols-[2fr_1fr] md:gap-4">
        <div v-if="music" class="order-1 md:order-2">
          <h2 class="text-lg font-bold">楽曲情報</h2>
          <div >
            <p class="text-sm text-cool-500">歌唱：{{ music.singer.join(', ') }}</p>
            <p class="text-sm text-cool-500">作詞：{{ music.lyricist.join(', ') }}</p>
            <p class="text-sm text-cool-500">作曲：{{ music.composer.join(', ') }}</p>
            <p class="text-sm text-cool-500">編曲：{{ music.arranger.join(', ') }}</p>
            <p class="text-sm text-cool-500">リリース：{{ music.releaseDate }}</p>
          </div>

          <div class="flex flex-wrap mb-4">
            <ULink v-for="tag in music.tags" :key="tag" :to="`/tags/${tag}`" class="mr-2 mb-1 text-xs text-primary-500">
              #{{ tag }}
            </ULink>
          </div>
          <UAccordion multiple :items="items">
            <template #explanation>
              <p class="whitespace-pre-wrap">
                {{ music.explanation }}
              </p>
            </template>
            <template #feeling>
              <p class="whitespace-pre-wrap">
                {{ music.feeling }}
              </p>
            </template>
          </UAccordion>
        </div>

        <div class="order-2 md:order-1">
          <div v-for="lyric in lyrics" :key="lyric.id" class="pb-5">
            <div v-if="lyric.hymmnos" class="flex flex-wrap">
              <WordHymmnos v-for="(word, index) in getLyricWords(lyric.hymmnos)" :word="word" :key="index" small
                class="mr-2" />
            </div>
            <p v-if="lyric.hymmnos" class="text-sm text-cool-500 mt-1">{{ lyric.japanese }}</p>
            <p v-else><span v-html="getJapaneseRuby(lyric.japaneseRuby ?? lyric.japanese ?? '')"></span></p>
          </div>
        </div>
      </div>

    </Layout>
  </template>

  <script setup lang="ts">
  const { getWords } = useDictionary();
  // SSRでidを取得
  const key = useRoute().params.key;

  // assets/datas/lyrics_hymmnos.jsonを読み込む
  const lyricsHymmnos = await import('@/assets/datas/lyrics_hymmnos.json');

  // assets/datas/musics.jsonを読み込む
  const musics = await import('@/assets/datas/musics.json');

  // データを取得
  const music = musics.default[key as keyof typeof musics.default];
  const lyrics = lyricsHymmnos.default.filter((lyric) => lyric.id === music?.id);

  // データが存在しない場合は404
  if (!lyrics.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    });
  }

  // データを表示
  const getLyricWords = (hymmnos: string) => {
    return getWords(hymmnos)[0];
  };

  const getJapaneseRuby = (japaneseRuby: string) => {
    return japaneseRuby.replace(/\[(.*?)\]\((.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>').replace(/\s/g, '　');
  };

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

  </script>

  <style>
  ruby rt {
    font-size: 0.5rem;
  }
  </style>
