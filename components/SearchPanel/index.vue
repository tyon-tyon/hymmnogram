<template>
  <UTextarea
    v-model="keyword"
    :rows="1"
    autoresize
    class="mb-4"
    placeholder="ヒュムノス辞書で検索したいキーワードを入力"
  />
  <UTabs :items="items" class="w-full">
    <template #default="{ item, selected }">
      <span
        class="truncate"
        :class="[
          selected && 'text-primary-500 dark:text-primary-400',
        ]"
        >{{ item.label }}</span
      >
    </template>
    <template v-if="keyword.length" #item="{ item }">
      <SearchPanelHymmnosResult
        v-if="item.key === 'hymmnos'"
        :keyword="keyword"
      />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
const keyword = ref("");
const items = [
  {
    key: "hymmnos",
    label: "ヒュムノス",
  },
  {
    key: "foreluna",
    label: "律史前月読(月奏)",
  },
  {
    key: "arciela",
    label: "アルシエラ(星語)",
  },
];

const accountForm = reactive({ name: "Benjamin", username: "benjamincanac" });
const passwordForm = reactive({ currentPassword: "", newPassword: "" });

function onSubmit(form: any) {
  console.log("Submitted form:", form);
}
</script>

<style></style>
