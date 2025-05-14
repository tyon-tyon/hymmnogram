<template>
  <UPopover overlay>
    <UButton size="xs" color="white" :label="` ${showItems.length}/${items.length}`"
      trailing-icon="i-heroicons-chevron-down-20-solid" class="m-1" />
    <template #panel>
      <UButton size="xs" color="white" label="全選択" class="m-1" @click="selectAll" />
      <UButton size="xs" color="white" label="クリア" class="m-1" @click="clear" />
      <div class="p-2">
        <UCheckbox v-for="item in items" :key="item.name" :label="item.japanese"
          :model-value="showItems.includes(item.name)" @change="
            (value: boolean) => {
              if (value) {
                showItems = [...showItems, item.name];
              } else {
                // チェックを外した場合は、showItemsから削除
                showItems = showItems.filter((i) => i !== item.name);
              }
            }
          " />
      </div>
    </template>
  </UPopover>
  <!--表示カラム-->
</template>

<script setup lang="ts">
const { items } = defineProps<{
  items: { name: string; japanese: string; }[];
}>();

// 表示するアイテム
const showItems = defineModel<string[]>("showItems", { required: true });

const selectAll = () => {
  showItems.value = items.map((item) => item.name);
};

const clear = () => {
  showItems.value = [];
};
</script>