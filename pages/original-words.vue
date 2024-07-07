<template>
  <Layout>
    <h1 class="text-2xl flex justify-between items-center mb-5">
      オリジナル単語
      <OriginalWordsHelp />
    </h1>
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
        <HymmnosTable :words="originalWords?.slice(0, 5)" />
      </template>
      <template #all>
        <HymmnosTable :words="originalWords" />
      </template>
    </UAccordion>

    <UButton @click="saveLocalStorage" class="my-10" size="xl" block>
      保存
    </UButton>
  </Layout>
</template>

<script setup lang="ts">
import type { TDialectData } from "~/types";

const { pureDialects, updateDialects } = useDialect();
const { updateWords } = useDictionary();
const { updateOriginalWords, updateOriginalDialects, originalWords } =
  useOriginal();
// 単語データ
const wordsStr = ref("");
// 意味の区切り文字
const delimiter = ref("、");
// 新規流派
const newDialects = ref<TDialectData[]>([]);

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

<style scoped>
/** */
</style>
