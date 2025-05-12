<template>
  <Layout :breadcrumb-links="[{label: 'オリジナル単語登録', to: '/original-words' }]">
    <AtomH2 class="flex justify-between">
      オリジナル単語登録
      <OriginalWordsHelp />
    </AtomH2>
    <UFormGroup label="単語データ" name="words">
      <UTextarea
        v-model="wordsStr"
        :rows="10"
        class="mb-4"
        placeholder="単語	意味	発音	品詞	流派	備考
cye	羞恥　恥ずかしい　照れ	チェ	想音	アルファ律（オリジンスペル：TOLIA属）	第Ⅱ想音
dojy	不安　迷い　困惑	ドージュ	想音	アルファ律（オリジンスペル：TOLIA属）	第Ⅱ想音	
dott	勇敢さ　勇猛に	ドッ	想音	アルファ律（オリジンスペル：TOLIA属）	第Ⅱ想音"
      />
    </UFormGroup>

    <UFormGroup label="意味の区切り文字" name="delimiter">
      <UInput v-model="delimiter" class="mb-4" placeholder="、" />
    </UFormGroup>
    <UFormGroup label="流派設定" name="dialect">
      <OriginalDialectTable />
    </UFormGroup>

    <UAccordion :items="items">
      <template #examples>
        <!-- 冒頭5件だけ表示 -->
        <TableHymmnos :words="originalWords" :defaultRowCount="5" />
      </template>
    </UAccordion>

    <UButton @click="saveLocalStorage" class="my-10" size="xl" block>
      保存
    </UButton>
  </Layout>
</template>

<script setup lang="ts">
import type { TDialect } from "~/types";
useHead({
  title: 'オリジナル単語登録',
  meta: [
    { name: "description", content: 'オリジナル単語をヒュムノス語として登録することができます。' },
    { property: 'og:title', content: 'オリジナル単語登録' },
    { property: 'og:description', content: 'オリジナル単語をヒュムノス語として登録することができます。' },
    { property: 'og:url', content: 'https://hymmnogram.fau-varda.net/original-words' },
  ],
  link: [
    { rel: 'canonical', href: 'https://hymmnogram.fau-varda.net/original-words' },
  ],
});
const { pureDialects, updateDialects } = useDialect();
const { updateWords } = useDictionary();
const { updateOriginalWords, updateOriginalDialects, originalWords } =
  useOriginal();
// 単語データ
const wordsStr = ref("");
// 意味の区切り文字
const delimiter = ref("、");
// 新規流派
const newDialects = ref<TDialect[]>([]);

const items = [
  {
    label: "登録データサンプル",
    slot: "examples",
    defaultOpen: true,
  },
  {
    label: "登録データ(全件)",
    slot: "all",
  },
];

onMounted(() => {
  // ローカルストレージからデータを取得
  const storage = {
    words: localStorage.getItem("originalWords") ?? "",
    delimiter: localStorage.getItem("originalWordsDelimiter") ?? "",
    dialect: localStorage.getItem("originalDialects") ?? "[]",
  };
  // 辞書データを更新
  wordsStr.value = storage.words;
  delimiter.value = storage.delimiter;
});

watch(
  () => [wordsStr.value, delimiter.value],
  () => {
    // 単語データを更新
    const words = updateOriginalWords(wordsStr.value, delimiter.value);
    if (!words) return;
    // 流派データを取得
    const originalDialects = Array.from(
      new Set(words.map((word) => word.dialect))
    ).map((dialect) => {
      // 既存の流派とマッチする場合はそのcolorを返す
      const dialectJapanese = dialect ?? "";
      const color =
        pureDialects.find((d) => dialectJapanese.includes(d.japanese))?.color ??
        "stone";
      return {
        name: dialect,
        color,
        japanese: dialect,
      };
    });
    // 流派データを更新
    newDialects.value = updateOriginalDialects(originalDialects);
    updateDialects(newDialects.value);
    updateWords(words);
  }
);

const toast = useToast();
const saveLocalStorage = () => {
  // 保存
  localStorage.setItem("originalWords", wordsStr.value);
  localStorage.setItem("originalWordsDelimiter", delimiter.value);
  localStorage.setItem("originalDialects", JSON.stringify(newDialects.value));
  toast.add({ title: "保存しました" });
};
</script>
