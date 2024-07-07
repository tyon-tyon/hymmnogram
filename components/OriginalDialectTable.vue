<template>
  <UTable
    :rows="dialectsWithClass"
    :columns="columns"
    :empty-state="{ icon: null, label: null }"
  >
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
</template>

<script setup lang="ts">
const { updateOriginalDialects, originalDialects } = useOriginal();
const { updateDialects,dialects } = useDialect();
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
