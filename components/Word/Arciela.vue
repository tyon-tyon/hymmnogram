<template>
  <div
    class="arciela-word"
    :class="{
      'not-small': !small,
    }"
  >
    <template v-if="word.chars.length">
      <div class="flex flex-col">
        <div v-if="font" class="font-arciela text-3xl">
          <span v-for="char in word.chars" :key="char.char">
            {{ geFontStr(char.char, char.session, char.envelope) }}
          </span>
        </div>
        <div class="flex flex-row">
          <div v-for="char in word.chars" :key="char.char" class="mx-1">
            <div
              class="arciela flex justify-center"
              :class="{
                'text-xl': !small,
              }"
            >
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
            </div>
            <div
              class="text-cool-400 japanese leading-none"
              :class="{
                'text-sm': !small,
                'text-2xs': small,
              }"
            >
              <div v-for="caption in char.caption?.split('/')" :key="caption">
                {{ caption }}
              </div>
            </div>
          </div>
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
import type { TArcielaWordData } from "~/types";
const { word } = defineProps<{
  word: TArcielaWordData;
  small?: boolean;
  font?: boolean;
}>();
const { geFontStr } = useArciela();
</script>

<style scoped>
.arciela-word {
  display: flex;
  text-align: center;
}
.not-small {
  min-height: 70px;
  padding: 16px 10px 4px 8px;
  flex: 1 1 auto;
  border-bottom: 1px solid rgb(229, 229, 229);
}
.japanese {
  word-break: keep-all;
  text-wrap: nowrap;
}
</style>
