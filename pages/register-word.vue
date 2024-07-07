<template>
  <Layout>
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
      <UTable :rows="dialectsWithClass" :columns="columns">
        <template #name-data="{ row }">
          <span :class="row.class">{{ row.japanese }}</span>
        </template>
        <template #color-data="{ row }">
          <UDropdown
            :items="colors"
            :popper="{ placement: 'auto' }"
            height="h-48"
            :ui="{
              base: 'relative focus:outline-none overflow-y-auto scroll-py-1 h-48',
            }"
          >
            <template #default>
              <UButton
                color="white"
                class="w-full"
                @click="selectedDialect = row.name"
              >
                {{ row.color }}
              </UButton>
            </template>
            <template
              #item="{ item }"
              @click="
                () => {
                  console.log();
                }
              "
            >
              {{ item.label }}
            </template>
          </UDropdown>
        </template>
      </UTable>
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
  </Layout>
</template>

<script setup lang="ts">
const { dialects, updateDialects } = useDialect();
const { updateWords } = useDictionary();
const {
  updateOriginalWords,
  updateOriginalDialects,
  originalWords,
  originalWordsStr,
  originalDialects,
  originalWordsDelimiter,
} = useOriginal();
const wordsStr = ref(originalWordsStr);
// 意味の区切り文字
const delimiter = ref(originalWordsDelimiter);

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
const columns = [
  {
    key: "name",
    label: "流派",
    class: "bold",
  },
  {
    key: "color",
    label: "色",
  },
];

const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
].map((color) => [
  {
    label: color,
    class: `text-${color}-400`,
    click: () => updateDialect(color),
  },
]);
const selectedDialect = ref("");
const dialectsWithClass = computed(() =>
  originalDialects.value.map((dialect) => ({
    ...dialect,
    class: `text-${dialect.color}-400`,
  }))
);

watch(
  () => wordsStr.value,
  () => {
    // 保存
    localStorage.setItem("originalWords", wordsStr.value);
    localStorage.setItem("originalWordsDelimiter", delimiter.value);
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
        dialects.value.find((d) => dialectJapanese.includes(d.japanese))
          ?.color ?? "stone";
      return {
        name: dialect,
        color,
        japanese: dialect,
      };
    });
    // 保存
    localStorage.setItem("originalDialects", JSON.stringify(originalDialects));

    updateDialects(updateOriginalDialects(originalDialects));
    updateWords(words);
  }
);

const updateDialect = (color: string) => {
  const index = originalDialects.value.findIndex(
    (d) => d.name === selectedDialect.value
  );
  if (index === -1) return;
  originalDialects.value[index].color = color;
  updateOriginalDialects(originalDialects.value);
  localStorage.setItem(
    "originalDialects",
    JSON.stringify(originalDialects.value)
  );
  updateDialects(originalDialects.value);
};
</script>

<style scoped>
/** */
</style>
