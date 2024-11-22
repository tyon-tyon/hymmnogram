<template>
  <div
    class="arciela-word pr-4"
    :class="{
      'not-small': !small,
    }"
  >
    <div class="flex flex-col">
      <div v-if="font" class="font-arciela text-3xl">
        <span v-for="char in word.chars" :key="char.char">
          {{ geFontStr(char.char, char.session, char.envelope) }}
        </span>
      </div>
      <div class="flex flex-row">
        <div v-for="char in word.chars" :key="char.char" class="mx-1">
          <div
            class="arciela"
            :class="{
              'text-xl': !small,
            }"
          >
            {{ char.char }}
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
  padding: 16px 8px 4px;
  flex: 1 1 auto;
  border-bottom: 1px solid rgb(229, 229, 229);
}
.japanese {
  word-break: keep-all;
  text-wrap: nowrap;
}
</style>
