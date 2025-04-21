<template>
  <AtomModal v-model:visible="isOpen" title="シェアする">
    <AtomP>
      <AtomP class="whitespace-pre-wrap">
        {{ text }}
        <AtomLink :href="url" target="_blank" class="pointer-events-none">
          {{ url }}
        </AtomLink>
      </AtomP>
    </AtomP>
    <UButton block color="black" @click="shareX">
      X(Twitter)
    </UButton>
  </AtomModal>
</template>

<script setup lang="ts">
const { text, url } = defineProps<{
  text: string;
  url: string;
}>();
const isOpen = defineModel<boolean>('visible', { required: true });


const shareX = () => {
  const encodedText = encodeURIComponent(`${text}\nHYMMNOGRAM ${url}`);
  window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank');
};
</script>