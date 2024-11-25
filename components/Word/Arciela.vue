<template>
  <WordWrapper :small :japanese>
    <WordArHym :small arciela>
      <span v-for="char in word.chars" :key="char.char">
        {{ geFontStr(char.char, char.session, char.envelope) }}
      </span>
    </WordArHym>
    <div class="flex flex-row">
      <div v-for="char in word.chars" :key="char.char" class="mx-1">
        <WordAlphabet :small class="flex justify-center">
          <div>
            {{ char.char }}
          </div>
          <div
            v-if="char.session !== undefined && char.envelope !== undefined"
            class="flex flex-col text-left leading-none ml-0.5 justify-center text-cool-400"
          >
            <div class="text-2xs">s-{{ char.session }}</div>
            <div class="text-3xs text-nowrap">
              {{ char.envelope }}
            </div>
          </div>
        </WordAlphabet>
        <WordJapanese :small>
          <div
            v-for="(caption, index) in char.caption?.split('/')"
            :key="index + caption"
          >
            {{ caption }}
          </div>
        </WordJapanese>
      </div>
    </div>
  </WordWrapper>
</template>

<script setup lang="ts">
import type { TArcielaWord } from "~/types";
const { word } = defineProps<{
  word: TArcielaWord;
  small?: boolean;
  font?: boolean;
}>();
const { geFontStr } = useArciela();
const japanese = word.chars.length === 0 ? word.word : undefined;
</script>
