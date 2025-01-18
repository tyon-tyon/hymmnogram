<template>
  <WordWrapper :small :japanese>
    <WordArHym :small arCiela>
      {{ word.word }}
    </WordArHym>
    <div class="flex">
      <div
        v-for="(section, index) in word.sections"
        :key="index + 'section'"
        class="mx-0.5"
      >
        <WordAlphabet :small class="flex justify-center">
          {{ section.map((char) => char.char).join("") }}
        </WordAlphabet>
        <WordJapanese :small>
          {{ section.map((char) => char.meaning).join(", ") }}
        </WordJapanese>
      </div>
    </div>
  </WordWrapper>
</template>

<script setup lang="ts">
import type { TForelunaWord } from "~/types";
const { word } = defineProps<{
  word: TForelunaWord;
  small?: boolean;
  font?: boolean;
}>();

const japanese = !word.word.match(/^[a-zA-Z]+$/) ? word.word : undefined;
</script>
