<template>
  <div class="flex items-center">
    <div class="keyboard">
      <UButtonGroup size="xs" orientation="horizontal" class="mb-1">
        <UButton
          :color="mode === 'compartment' ? 'primary' : 'white'"
          @click="mode = 'compartment'"
        >
          コンパートメント
        </UButton>
        <UButton
          :color="mode === 'arciela_font' ? 'primary' : 'white'"
          @click="mode = 'arciela_font'"
        >
          アルシエラフォント
        </UButton>
        <UButton
          :color="mode === 'none' ? 'primary' : 'white'"
          @click="mode = 'none'"
        >
          なし
        </UButton>
      </UButtonGroup>
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
          @click="$emit('delete-char')"
          color="white"
          :hover-char="hoverChar"
          @mouseover="hoverChar = ''"
          @mouseleave="hoverChar = ''"
        >
          <div class="text-2xs">←</div>
        </KeyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Key from "./Key.vue";
defineProps<{
  keyword: string;
}>();

const { arcielaChars, sessionToSymbol } = useArciela();
const mode = ref<"none" | "compartment" | "arciela_font">("compartment");
const emit = defineEmits(["input-char", "delete-char"]);
const hoverChar = ref("");

const input = ({ char, session }: { char: string; session: number }) => {
  hoverChar.value = "";
  if (session === -1 || mode.value === "none") {
    emit("input-char", char.toLocaleLowerCase());
    return;
  }
  if (mode.value === "compartment")
    emit("input-char", char.toLocaleLowerCase() + `[s-${session}]`);
  if (mode.value === "arciela_font")
    emit("input-char", char.toLocaleLowerCase() + sessionToSymbol(session));
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
