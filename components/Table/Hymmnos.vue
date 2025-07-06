<template>
  <!--流派絞り込み-->
  <div class="flex flex-wrap justify-end">
    <!--表示カラム-->
    <UButtonGroup size="xs" orientation="horizontal" class="flex-1 flex items-center justify-center m-1">
      <UButton v-for="column in columns.filter((c) => c.label)" :key="column.key"
        :color="selectedColumns[columns.indexOf(column)] ? 'primary' : 'white'" @click="toggleColumn(column)"
        class="flex-1 items-center justify-center text-nowrap">
        {{ column.label }}
      </UButton>
    </UButtonGroup>
  </div>
  <UTable :rows="rows.slice(0, showAll ? undefined : defaultRowCount)"
    :columns="columns.filter((_, index) => selectedColumns[index])" sortable
    :empty-state="{ icon: '', label: '単語が見つかりません...' }">
    <template #hymmnos-data="{ row }">
      <span class="font-bold" :class="row.itemClass">
        {{ row.hymmnos }}
      </span>
    </template>
    <template #japanese-data="{ row }">
      <span class="text-wrap" :class="row.itemClass">
        {{ row.japanese }}
      </span>
    </template>
    <template #pronunciation-data="{ row }">
      <span class="text-wrap" :class="row.itemClass">
        {{ row.pronunciation }}
      </span>
    </template>
    <template #part_of_speech-header>
      <div class="flex items-center">
        品詞
        <TableFilter :items="partOfSpeeches" v-model:show-items="showPartOfSpeech" />
      </div>
    </template>
    <template #part_of_speech-data="{ row }">
      <span class="text-wrap" :class="row.itemClass">
        {{ row.part_of_speech }}
      </span>
    </template>
    <template #dialect-header>
      <div class="flex items-center">
        流派
        <TableFilter :items="dialects" v-model:show-items="showDialects" />
      </div>
    </template>
    <template #dialect-data="{ row }">
      <span class="text-wrap" :class="row.itemClass">
        {{ row.dialect }}
      </span>
    </template>
    <template #explanation-data="{ row }">
      <span class="text-wrap max-w-xs text-xs" :class="row.itemClass">
        {{ row.explanation }}
      </span>
    </template>
    <template #actions-data="{ row }">
      <UButton size="sm" color="white" square variant="solid" @click="() => $emit('input-word', row)">
        入力
      </UButton>
    </template>
  </UTable>
  <UButton v-if="rows.length > defaultRowCount && !showAll" @click="showAll = !showAll" class="w-full" color="primary"
    variant="link" size="xl" block>
    全て表示 (全{{ rows.length }}件)
  </UButton>
</template>

<script setup lang="ts">
import type { TWord } from "~/types";
const props = withDefaults(
  defineProps<{
    words?: TWord[]; // オリジナルの単語専用
    action?: boolean;
    defaultRowCount?: number;
    showColumns?: string[];
  }>(),
  {
    defaultRowCount: 10,
    action: false,
  }
);
const keyword = defineModel<string>("keyword");
const { action } = props;
const { getDialectTextClass, getDialectBgClass } = useStyles();
const { getDiarectJapanese, dialects } = useDialect();
const dictionary = useDictionary();

const columns = [
  {
    key: "hymmnos",
    label: "単語",
    class: "bold",
  },
  {
    key: "japanese",
    label: "意味",
  },
  {
    key: "pronunciation",
    label: "発音",
  },
  {
    key: "part_of_speech",
    label: "品詞",
  },
  {
    key: "dialect",
    label: "流派",
  },
  {
    key: "explanation",
    label: "備考",
  },
  {
    key: "actions",
  },
];

const showAll = ref<boolean>(false);

// 部分一致検索
const words = computed(() => {
  if (props.words) return props.words;
  if (!keyword.value?.length) return dictionary.words.value;
  // 日本語の用例はOR検索をする
  if (keyword.value.match(/^[^a-zA-Z0-9]+$/)) {
    const words = keyword.value.replace(/　/g, " ").split(" ").map(word => dictionary.getPartialMatch(word));
    return [...new Set(words.flat())];
  }
  return dictionary
    .getPartialMatch(keyword.value);
});

// 表示するカラム
const selectedColumns = ref(new Array<boolean>(columns.length).fill(true));
const toggleColumn = (column: any) => {
  const index = columns.indexOf(column);
  selectedColumns.value[index] = !selectedColumns.value[index];
};

// 表示する品詞
const partOfSpeeches = ref<{ name: string; japanese: string }[]>([]);
const showPartOfSpeech = ref<string[]>([]);
const initPartOfSpeechFilter = () => {
  // 品詞の出現回数をカウント
  const partOfSpeechCounts: Record<string, number> = dictionary.words.value.reduce((acc, word) => {
    acc[word.part_of_speech] = (acc[word.part_of_speech] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  partOfSpeeches.value = Object.entries(partOfSpeechCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number)) // 出現回数の多い順にソート
    .map(([name]) => ({ name, japanese: name }));
  showPartOfSpeech.value = partOfSpeeches.value.map((p) => p.name);
};

// 表示する流派
const showDialects = ref<string[]>([]);
const initDialectFilter = () => {
  showDialects.value = dialects.value.map((dialect) => dialect.name);
};

const rows = ref<any[]>([]);

defineEmits(["input-word"]);

watch(
  () => keyword.value,
  () => {
    showAll.value = false;
  }
);

// 完全一致検索
const exactWord = computed(() => {
  return dictionary.getExactMatch(keyword.value ?? "");
});

// 表示する単語を更新
watch(
  () => [showDialects.value, showPartOfSpeech.value, words.value, showAll.value],
  () => {
    rows.value = [
      ...(exactWord.value ? [exactWord.value] : []).map((word: TWord) => ({
        ...word,
        class: " border-b-4",
      })),
      ...words.value,
    ]
      .filter((word) => {
        const matchPartOfSpeech = !partOfSpeeches.value.some((p) => p.name === word.part_of_speech) || showPartOfSpeech.value.includes(word.part_of_speech)
        return showDialects.value.includes(word.dialect) && matchPartOfSpeech;
      })
      .map(getWordItem);
  }
);

onMounted(() => {
  initDialectFilter();
  initPartOfSpeechFilter();
  // 備考列を非表示
  selectedColumns.value[5] = false;
  if (props.showColumns) {
    // 表示する列が指定されている場合はその列を表示
    selectedColumns.value = columns.map((column) =>
      !!props.showColumns?.includes(column.key)
    );
    return;
  }
  // ウィンドウ幅がスマホサイズの場合は「意味」列を非表示
  if (window.innerWidth < 640)
    selectedColumns.value[2] =
      selectedColumns.value[3] =
      selectedColumns.value[4] =
      selectedColumns.value[5] =
      false;
  if (!action) {
    selectedColumns.value[6] = false;
  }
});

const getWordItem = (word: TWord & { class?: string; }) => {
  return {
    hymmnos: word.hymmnos,
    japanese: word.primaryMeaning ?? "" + word.japanese.join(", ") + (word.gerunds?.length ? " (名詞: " + word.gerunds.join(", ") + ")" : ""),
    pronunciation: word.pronunciation?.join(", "),
    part_of_speech: word.part_of_speech,
    dialect: getDiarectJapanese(word.dialect),
    class: getDialectBgClass(word.dialect) + (word.class ?? ""),
    itemClass: getDialectTextClass(word.dialect),
    explanation: word.explanation,
  };
};
</script>
