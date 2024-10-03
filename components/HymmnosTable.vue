<template>
  <!--流派絞り込み-->
  <div class="flex flex-wrap justify-end">
    <UPopover overlay>
      <UButton
        size="xs"
        color="white"
        :label="`表示流派:${showDialects.length}流派`"
        trailing-icon="i-heroicons-chevron-down-20-solid"
        class="m-1"
      />
      <template #panel>
        <div class="p-2">
          <UCheckbox
            v-for="dialect in dialects"
            :key="dialect.name"
            :label="dialect.japanese"
            :model-value="showDialects.includes(dialect.name)"
            @change="
              () => {
                if (showDialects.includes(dialect.name)) {
                  showDialects = showDialects.filter((d) => d !== dialect.name);
                } else {
                  showDialects.push(dialect.name);
                }
              }
            "
          />
        </div>
      </template>
    </UPopover>
    <!--表示カラム-->
    <UButtonGroup
      size="xs"
      orientation="horizontal"
      class="flex-1 flex items-center justify-center m-1"
    >
      <UButton
        v-for="column in columns.filter((c) => c.label)"
        :key="column.key"
        :color="selectedColumns[columns.indexOf(column)] ? 'primary' : 'white'"
        @click="toggleColumn(column)"
        class="flex-1 items-center justify-center text-nowrap"
      >
        {{ column.label }}
      </UButton>
    </UButtonGroup>
  </div>
  <UTable
    :rows="rows.slice(0, showAll ? undefined : defaultRowCount)"
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
  <UButton
    v-if="rows.length > defaultRowCount && !showAll"
    @click="showAll = !showAll"
    class="w-full"
    color="primary"
    variant="link"
    size="xl"
    block
  >
    全て表示 (全{{ rows.length }}件)
  </UButton>
</template>

<script setup lang="ts">
import type { TWordData } from "~/types";
const props = withDefaults(
  defineProps<{
    words: TWordData[];
    exactWord?: TWordData;
    action?: boolean;
    defaultRowCount?: number;
  }>(),
  {
    defaultRowCount: 10,
    action: false,
  }
);
const { action } = props;
const { words, exactWord } = toRefs(props);
const { getDialectTextClass, getDialectBgClass } = useStyles();
const { getDiarectJapanese, dialects } = useDialect();

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

const selectedColumns = ref(new Array<boolean>(columns.length).fill(true));
const toggleColumn = (column: any) => {
  const index = columns.indexOf(column);
  selectedColumns.value[index] = !selectedColumns.value[index];
};

const showDialects = ref<string[]>([]);
const initDialectFilter = () => {
  showDialects.value = dialects.value
    .map((dialect) => dialect.name)
    .filter((name) => name !== "unknown");
};


const rows = ref<any[]>([]);

defineEmits(["input-word"]);

watch(
  () => props.words,
  () => {
    showAll.value = false;
  }
);

// 流派データが更新されたら表示する流派を再度全選択
watch(
  () => dialects.value,
  () => {
    initDialectFilter();
  }
);

// 表示する単語を更新
watch(
  () => [showDialects.value.length, words.value, showAll.value],
  () => {
    rows.value = [
      ...(exactWord.value ? [exactWord.value] : []).map((word: TWordData) => ({
        ...word,
        class: " border-b-4",
      })),
      ...words.value,
    ]
      .filter((word) => {
        return showDialects.value.includes(word.dialect);
      })
      .map(getWordItem);
  }
);

onMounted(() => {
  initDialectFilter();
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

const getWordItem = (word: TWordData & { class?: string }) => {
  return {
    hymmnos: word.hymmnos,
    japanese: word.primaryMeaning ?? "" + word.japanese.join(", "),
    pronunciation: word.pronunciation,
    part_of_speech: word.part_of_speech,
    dialect: getDiarectJapanese(word.dialect),
    class: getDialectBgClass(word.dialect) + (word.class ?? ""),
    itemClass: getDialectTextClass(word.dialect),
    explanation: word.explanation,
  };
};
</script>
