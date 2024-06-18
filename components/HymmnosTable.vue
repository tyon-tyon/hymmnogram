<template>
  <UButtonGroup
    size="sm"
    orientation="horizontal"
    class="w-full flex items-center justify-center"
  >
    <UCheckbox v-model="includeUnknown" label="未登録" class="checkbox mr-2" />
    <UButton
      v-for="column in columns.filter((c) => c.label)"
      :key="column.key"
      :color="selectedColumns[columns.indexOf(column)] ? 'primary' : 'white'"
      @click="toggleColumn(column)"
      class="flex-1 items-center justify-center"
    >
      {{ column.label }}
    </UButton>
  </UButtonGroup>
  <UTable
    :rows="
    [
      ...(exactWord?[exactWord]:[])
      .map((word: TWordData) => ({...getWordItem(word), class: getWordItem(word).class + ' border-b-4'})),
      ...words
      .filter((word: TWordData) => includeUnknown || word.dialect !== 'unknown')
      .map((word: TWordData) => getWordItem(word))
      ]
    "
    :columns="columns.filter((_, index) => selectedColumns[index])"
    sortable
    :empty-state="{ icon: null, label: '単語が見つかりません...' }"
  >
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
    <template #part_of_speech-data="{ row }">
      <span class="text-wrap" :class="row.itemClass">
        {{ row.part_of_speech }}
      </span>
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
      <UButton
        size="sm"
        color="white"
        square
        variant="solid"
        @click="() => $emit('input-word', row)"
      >
        入力
      </UButton>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { TWordData } from "~/types";
const { words, action } = defineProps<{
  words: TWordData[];
  exactWord?: TWordData;
  action?: boolean;
}>();
const { getDialectTextClass, getDiarectJapanese, getDialectBgClass } =
  useStyles();

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
    label: "読み",
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

const selectedColumns = ref(new Array<boolean>(columns.length).fill(true));
const toggleColumn = (column: any) => {
  const index = columns.indexOf(column);
  selectedColumns.value[index] = !selectedColumns.value[index];
};
const includeUnknown = ref(true);

defineEmits(["input-word"]);

// ウィンドウ幅がスマホサイズの場合は「意味」列を非表示
onMounted(() => {
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

const getWordItem = (word: TWordData) => {
  return {
    hymmnos: word.hymmnos,
    japanese: word.japanese.join(", "),
    pronunciation: word.pronunciation,
    part_of_speech: word.part_of_speech,
    dialect: getDiarectJapanese(word.dialect),
    class: getDialectBgClass(word.dialect),
    itemClass: getDialectTextClass(word.dialect),
    explanation: word.explanation,
  };
};
</script>
