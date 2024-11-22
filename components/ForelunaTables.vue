<template>
  <UTable
    :rows
    :columns="columns"
    class="w-full"
    :ui="{
      td: {
        padding: 'px-2 py-2',
      },
    }"
  >
    <template #char1-data="{ row }">
      {{ row.char1 }}
    </template>
    <template #caption1-data="{ row }">
      {{ row.caption1 }}
    </template>
    <template #char2-data="{ row }">
      {{ row.char2 }}
    </template>
    <template #caption2-data="{ row }">
      {{ row.caption2 }}
    </template>
  </UTable>
</template>

<script setup lang="ts">
const { forelunaChars } = useForeluna();

//母音のカラム
const columns = [
  {
    key: "char1",
    label: "文字",
  },
  {
    key: "caption1",
    label: "意味",
  },
  {
    key: "none",
    label: "",
  },
  {
    key: "char2",
    label: "文字",
  },
  {
    key: "caption2",
    label: "意味",
  },
];

// 2文字ずつ格納する
const rows: any = [];
for (let i = 0; i < forelunaChars.length; i += 2) {
  rows.push({
    char1: forelunaChars[i].char,
    caption1: forelunaChars[i].meaning,
    char2: forelunaChars[i + 1].char,
    caption2: forelunaChars[i + 1].meaning,
  });
}
</script>
