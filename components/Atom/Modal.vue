<template>
  <UModal v-model="visible">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      header: {
        padding: 'py-2',
      },
     }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="my-1"
            @click="visible = false" />
        </div>
      </template>
      <slot />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
const visible = defineModel<boolean>('visible', { required: true });
</script>