<template>
  <UTable
    :rows="arCielaChars.filter((c) => c.char.match(/[aiueon]/i))"
    :columns="columns1"
    class="w-full"
    :ui="{
      td: {
        padding: 'px-2 py-2',
      },
    }"
  >
    <template #char-data="{ row }">
      {{ row.char }}
    </template>
    <template #caption-data="{ row }">
      <div class="flex flex-wrap">
        <span
          v-for="(meaning, index) in row.meanings"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning }}
        </span>
      </div>
    </template>
  </UTable>
  <UTable
    :columns="columns2"
    :rows="arCielaChars.filter((c) => !c.char.match(/[aiueon]/i))"
    class="w-full"
    :ui="{
      th: { base: 'text-center rtl:text-right', padding: 'px-2 py-2' },
      td: {
        padding: 'px-2 py-2',
      },
    }"
  >
    <template #char-data="{ row }">
      {{ row.char }}
    </template>
    <template #caption-data="{ row }">
      {{ row.caption }}
    </template>
    <template #s0-data="{ row }">
      <div class="flex flex-wrap justify-center">
        <span
          v-for="(meaning, index) in row.meanings.slice(0, 1)"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning.length > 0 ? meaning : " - " }}
        </span>
      </div>
    </template>
    <template #s1-data="{ row }">
        <div class="flex flex-wrap justify-center">
        <span
          v-for="(meaning, index) in row.meanings.slice(1, 3)"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning.length > 0 ? meaning : " - " }}
        </span>
      </div>
    </template>
    <template #s2-data="{ row }">
        <div class="flex flex-wrap justify-center">
        <span
          v-for="(meaning, index) in row.meanings.slice(3, 5)"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning.length > 0 ? meaning : " - " }}
        </span>
      </div>
    </template>
    <template #s3-data="{ row }">
        <div class="flex flex-wrap justify-center">
        <span
          v-for="(meaning, index) in row.meanings.slice(5, 7)"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning.length > 0 ? meaning : " - " }}
        </span>
      </div>
    </template>
    <template #s4-data="{ row }">
        <div class="flex flex-wrap justify-center">
        <span
          v-for="(meaning, index) in row.meanings.slice(7, 9)"
          :key="index"
          class="mr-2 text-xs"
        >
          {{ meaning.length > 0 ? meaning : " - " }}
        </span>
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
const { arCielaChars } = useArCiela();

//母音のカラム
const columns1 = [
  {
    key: "char",
    label: "",
  },
  {
    key: "caption",
    label: "意味",
  },
];
const columns2 = [
  {
    key: "char",
    label: "",
  },
  {
    key: "caption",
    label: "意味",
  },
  {
    key: "s0",
    label: "0",
  },
  {
    key: "s1",
    label: "1",
  },
  {
    key: "s2",
    label: "2",
  },
  {
    key: "s3",
    label: "3",
  },
  {
    key: "s4",
    label: "4",
  },
];
</script>
