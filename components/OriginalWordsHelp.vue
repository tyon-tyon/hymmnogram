<template>
  <div>
    <UButton label="使い方" @click="isOpen = true" variant="outline" />
    <UModal v-model="isOpen">
      <UCarousel
        :items="items"
        :ui="{
          item: 'basis-full',
          container: 'rounded-lg',
        }"
        arrows
        class="w-full mx-auto"
      >
        <template #default="{ item }">
          <UCard class="ma-2">
            <img :src="item.image" class="w-full" draggable="false" />
            <template #footer>
              {{ item.caption }}
            </template>
          </UCard>
        </template>

        <template #prev="{ onClick, disabled }">
          <div @click="onClick">
            <UButton
              icon="i-heroicons-chevron-left"
              size="sm"
              color="primary"
              square
              variant="ghost"
              :disabled="disabled"
            />
          </div>
        </template>

        <template #next="{ onClick, disabled }">
          <div @click="() => (disabled ? (isOpen = false) : onClick())">
            <UButton
              icon="i-heroicons-chevron-right"
              size="sm"
              color="primary"
              square
              variant="ghost"
            />
          </div>
        </template>
      </UCarousel>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    image: "/images/original_words_help_1.png",
    caption:
      "EXCELやスプレッドシートから、単語データをコピー＆ペーストしてください。（タブが区切り文字になっています）",
  },
  {
    image: "/images/original_words_help_2.png",
    caption:
      "一行目のヘッダーを「単語」「意味」「発音」「品詞」「流派」「備考」に修正してください。順番は問いません。",
  },
  {
    image: "/images/original_words_help_3.png",
    caption:
      "意味で使われている区切り文字を選択してください。デフォルトは「、」です。",
  },
  {
    image: "/images/original_words_help_4.png",
    caption: "流派の色を設定してください。",
  },
  {
    image: "/images/original_words_help_5.png",
    caption:
      "登録するデータを確認し、問題がなければ「保存」ボタンを押して保存してください。",
  },
];

const isOpen = ref(false);
</script>
