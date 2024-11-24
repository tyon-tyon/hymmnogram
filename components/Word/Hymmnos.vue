<template>
  <div
    class="hymmnos-word"
    :class="{
      'not-small': !small,
    }"
  >
    <template v-if="word.hymmnos.length">
      <div
        v-if="hymmnosFont"
        class="font-hymmnos leading-relaxed"
        :class="{
          'text-2xl': !small,
          [getDialectTextClass(word.dialect)]: word.dialect,
        }"
      >
        {{ word.hymmnos }}
      </div>
      <div
        class="hymmnos"
        :class="{
          'text-xl': !small,
          [getDialectTextClass(word.dialect)]: word.dialect,
        }"
      >
        {{ word.hymmnos }}
      </div>
      <template v-if="word.primaryMeaning">
        <div
          class="text-cool-600 japanese"
          :class="{
            'text-sm': !small,
            'text-2xs': small,
          }"
        >
          {{ word.primaryMeaning }}
        </div>
        <div v-if="!small" class="text-xs text-cool-400">
          {{
            [...word.japanese, ...(word.gerunds ?? [])]
              .filter((m) => m !== word.primaryMeaning)
              .slice(1, 100)
              .join(" ")
          }}
        </div>
      </template>
      <template v-else>
        <div
          class="text-cool-600 japanese"
          :class="{
            'text-sm': !small,
            'text-2xs': small,
          }"
        >
          {{ word.japanese[0] }}
        </div>
        <div
          v-if="!small && word.japanese.slice(1, 100).length"
          class="text-xs text-cool-400"
        >
          {{ word.japanese.slice(1, 100).join(" ") }}
        </div>
      </template>
    </template>
    <template v-else>
      <div v-if="!small" class="text-ms text-cool-500">
        {{ word.japanese.join("") }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TWord } from "~/types";
const { word } = defineProps<{
  word: TWord;
  small?: boolean;
  hymmnosFont?: boolean;
}>();

const { getDialectTextClass } = useStyles();
</script>

<style scoped>
.hymmnos-word {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 4px 4px 2px;
}
.not-small {
  min-height: 70px;
  padding: 16px 8px 4px;
  flex: 1 1 auto;
  border-bottom: 1px solid rgb(229, 229, 229);
}
.hymmnos {
  word-break: keep-all;
  text-wrap: nowrap;
}
.japanese {
  text-wrap: nowrap;
}
</style>
