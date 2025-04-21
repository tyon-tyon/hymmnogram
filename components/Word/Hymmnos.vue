<template>
  <WordWrapper :small :japanese :lyric>
    <WordArHym v-if="!lyric" :small hymmnos :class="{
      [getDialectTextClass(word.dialect)]: word.dialect,
    }">
      {{ word.hymmnos }}
    </WordArHym>
    <WordAlphabet :small :class="{
      'text-xl': !small,
      [getDialectTextClass(word.dialect)]: word.dialect,
    }">
      {{ word.hymmnos }}
    </WordAlphabet>
    <WordJapanese :small>
      {{ word.primaryMeaning }}
    </WordJapanese>
    <div v-if="!small && !lyric" class="text-xs text-cool-400 leading-none text-nowrap pt-1">
      {{
        [...word.japanese, ...(word.gerunds ?? [])]
          .filter((m) => m !== word.primaryMeaning)
          .slice(0, 2)
          .join(" ")
      }}
    </div>
    <template v-if="(word.subWords?.length ?? 0) > 0">
      <div v-if="!lyric && !small" class="text-2xs text-cool-400 leading-none text-nowrap pt-1">
        {{
          word.subWords?.map((subWord) => subWord.primaryMeaning).join(" ")
        }}
      </div>
      <div v-else-if="!lyric && !small" class="flex flex-wrap justify-center">
        <WordHymmnos v-for="subWord in word.subWords" :key="subWord.hymmnos" :word="subWord" small class="mr-1"/>
      </div>
    </template>
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
