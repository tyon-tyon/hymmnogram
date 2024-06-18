<template>
  <div
    class="hymmnos-word"
    :class="{
      'not-small': !small,
    }"
  >
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
  </div>
</template>

<script setup lang="ts">
import type { TWordData } from "~/types";
const { word } = defineProps<{
  word: TWordData;
  small?: boolean;
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
