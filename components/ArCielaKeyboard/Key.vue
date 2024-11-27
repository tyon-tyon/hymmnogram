<template>
  <div class="key-button relative">
    <KeyButton
      @click="
        () => {
          if (char.char.match(/[AIUEON]/)) click(-1);
        }
      "
      class="relative w-full h-full"
      :color="highlight ? 'primary' : 'white'"
    >
      <div class="text-current">{{ char.char }}</div>
      <span class="text-2xs">{{ char.caption }}</span>
    </KeyButton>
    <template v-if="!char.char.match(/[AIUEON]/) && hoverChar === char.char">
      <KeyButton
        @click="click(0)"
        class="absolute sub-button bg-green-50"
        color="primary"
        variant="soft"
      >
        <div
          v-for="(m, i) in char.meanings.slice(0, 1)"
          class="text-2xs meaning"
          :key="i"
        >
          {{ i }}<br />
          {{ m }}
        </div>
      </KeyButton>
      <KeyButton
        @click="click(1)"
        class="absolute sub-button"
        color="primary"
        variant="soft"
      >
        <div
          v-for="(m, i) in char.meanings.slice(1, 3)"
          class="text-2xs meaning"
          :key="i"
        >
          {{ i + 1 }}<br />
          {{ m }}
        </div>
      </KeyButton>
      <KeyButton
        @click="click(2)"
        class="absolute sub-button"
        color="primary"
        variant="soft"
      >
        <div
          v-for="(m, i) in char.meanings.slice(3, 5)"
          class="text-2xs meaning"
          :key="i"
        >
          {{ i + 3 }}<br />
          {{ m }}
        </div>
      </KeyButton>
      <KeyButton
        @click="click(3)"
        class="absolute sub-button"
        color="primary"
        variant="soft"
      >
        <div
          v-for="(m, i) in char.meanings.slice(5, 7)"
          class="text-2xs meaning"
          :key="i"
        >
          {{ i + 5 }}<br />
          {{ m }}
        </div>
      </KeyButton>
      <KeyButton
        @click="click(4)"
        class="absolute sub-button"
        color="primary"
        variant="soft"
      >
        <div class="text-current">{{ char.char }}</div>
        <div class="flex w-full">
          <div class="text-2xs meaning flex-1">
            7<br />{{ char.meanings[7] }}
          </div>
          <div class="text-2xs meaning flex-1">
            8<br />{{ char.meanings[8] }}
          </div>
        </div>
      </KeyButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TArCielaChar } from "~/types";
const props = defineProps<{
  char: TArCielaChar;
  highlight?: boolean;
  hoverChar?: string;
}>();
const emit = defineEmits(["input"]);

const click = (session: number) => {
  emit("input", {
    char: props.char.char,
    session,
  });
};
</script>

<style scoped>
.key-button {
  aspect-ratio: 1;
  height: auto;
  width: 60px;
  max-width: calc(100% / 6);
  line-height: 1;
}
.sub-button {
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  z-index: 1;
  border-width: 2px;
}
/**1番目 */
.sub-button:nth-of-type(2) {
  transform: translateX(-100%);
  width: 60%;
  right: auto;
  flex-direction: column-reverse;
  border-right-width: 0;
  border-radius: 10px 0 0 10px;
}
/**2番目 */
.sub-button:nth-of-type(3) {
  transform: translateY(-100%);
  height: 60%;
  bottom: auto;
  flex-direction: row;
  border-bottom-width: 0;
  border-radius: 10px 10px 0 0;
}
/**3番目 */
.sub-button:nth-of-type(4) {
  transform: translateX(100%);
  width: 60%;
  left: auto;
  flex-direction: column;
  border-left-width: 0;
  border-radius: 0 10px 10px 0;
}
/**4番目 */
.sub-button:nth-of-type(5) {
  transform: translateY(100%);
  height: 60%;
  top: auto;
  flex-direction: row-reverse;
  border-top-width: 0;
  border-radius: 0 0 10px 10px;
}
/**5番目 */
.sub-button:nth-of-type(6) {
  border-width: 0.5px;
}
.sub-button .meaning {
  text-align: center;
  padding: 2px 0;
  line-height: 1;
  word-break: keep-all;
  text-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
