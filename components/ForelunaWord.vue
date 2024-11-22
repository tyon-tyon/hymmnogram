<template>
  <div
    class="foreluna-word"
    :class="{
      'not-small': !small,
    }"
  >
    <template v-if="word.word.match(/^[a-zA-Z]+$/)">
      <div v-if="font" class="font-arciela text-3xl">
        {{ word.word }}
      </div>
      <div
        class="foreluna"
        :class="{
          'text-xl': !small,
        }"
      >
        {{ word.word }}
      </div>
      <div class="sections" v-if="word.sections.length">
        <div
          v-for="(chars, index) in word.sections"
          :key="index"
          class="text-cool-400 section"
          :class="{
            'text-sm': !small,
            'text-2xs': small,
          }"
        >
          <span v-for="(c, i) in chars" :key="i">
            <span
              :class="{
                'font-black': !!c.char.match(/[A-Z]/),
              }"
            >
              {{ c.meaning }} </span
            >{{ i === chars.length - 1 ? "" : "," }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="!small" class="text-ms text-cool-500">
        {{ word.word }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TForelunaWordData } from "~/types";
const { word } = defineProps<{
  word: TForelunaWordData;
  small?: boolean;
  font?: boolean;
}>();
</script>

<style scoped>
.foreluna-word {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 8px 4px 2px;
}
.not-small {
  min-height: 70px;
  padding: 16px 8px 4px;
  flex: 1 1 auto;
  border-bottom: 1px solid rgb(229, 229, 229);
}
.foreluna {
  word-break: keep-all;
  text-wrap: nowrap;
}
.sections {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.section {
  display: flex;
  text-wrap: nowrap;
}
.section::after {
  flex-wrap: nowrap;
  content: ">";
  margin: 0 2px;
}
.section:last-child::after {
  content: "";
}
</style>
