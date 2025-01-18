<template>
  <WordWrapper :small :japanese :lyric>
    <WordArHym
      v-if="!lyric"
      :small
      hymmnos
      :class="{
        [getDialectTextClass(word.dialect)]: word.dialect,
      }"
    >
      {{ word.hymmnos }}
    </WordArHym>
    <WordAlphabet
      :small
      :class="{
        'text-xl': !small,
        [getDialectTextClass(word.dialect)]: word.dialect,
      }"
    >
      {{ word.hymmnos }}
    </WordAlphabet>
    <WordJapanese :small>
      {{ word.primaryMeaning }}
    </WordJapanese>
    <div
      v-if="!small && !lyric"
      class="text-xs text-cool-400 leading-none text-nowrap pt-1"
    >
      {{
        [...word.japanese, ...(word.gerunds ?? [])]
          .filter((m) => m !== word.primaryMeaning)
          .slice(1, 100)
          .join(" ")
      }}
    </div>
  </WordWrapper>
</template>

<script setup lang="ts">
import type { TWord } from "~/types";
const { word } = defineProps<{
  word: TWord;
  small?: boolean;
  lyric?: boolean;
  hymmnosFont?: boolean;
}>();

const { getDialectTextClass } = useStyles();

const japanese = word.hymmnos.length === 0 ? word.japanese.join("") : undefined;
</script>
