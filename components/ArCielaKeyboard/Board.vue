<template>
  <div class="flex flex-wrap">
    <Key
      v-for="char in arcielaChars.slice(0, 6)"
      :key="char.char"
      :char="char"
      @input="input"
      :highlight="
        !!keyword.length &&
        (char.meanings.some((g) => g.toLowerCase().includes(keyword)) ||
          char.caption?.includes(keyword))
      "
      @mouseover="hoverChar = ''"
    />
  </div>
  <div class="flex flex-wrap">
    <Key
      v-for="char in arcielaChars.slice(6, 100)"
      :key="char.char"
      :char="char"
      @input="input"
      :highlight="
        !!keyword.length &&
        (char.meanings.some((g) => g.toLowerCase().includes(keyword)) ||
          char.caption?.includes(keyword))
      "
      :hover-char="hoverChar"
      @mouseover="hoverChar = char.char"
      @mouseleave="hoverChar = ''"
    />
    <KeyButton
      class="key-button"
      @click="input({ char: ' ', session: -1 })"
      color="white"
      @mouseover="hoverChar = ''"
    >
      <div class="text-2xs">空白</div>
    </KeyButton>
    <KeyButton
      class="key-button"
      @click="input({ char: '\n', session: -1 })"
      color="white"
      @mouseover="hoverChar = ''"
    >
      <div class="text-2xs">改行</div>
    </KeyButton>
    <KeyButton
      class="key-button"
      @click="$emit('delete')"
      color="white"
      :hover-char="hoverChar"
      @mouseover="hoverChar = ''"
      @mouseleave="hoverChar = ''"
    >
      <div class="text-2xs">←</div>
    </KeyButton>
  </div>
</template>

<script setup lang="ts">
import Key from "./Key.vue";
defineProps<{
  keyword: string;
}>();

const { arcielaChars } = useArciela();
const emit = defineEmits(["input", "delete"]);
const hoverChar = ref("");

const input = ({ char, session }: { char: string; session: number }) => {
  hoverChar.value = "";
  emit("input", { char, session });
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
</style>
