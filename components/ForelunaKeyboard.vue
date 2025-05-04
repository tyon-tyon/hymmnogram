<template>
  <div class="flex items-center">
    <div class="max-w-[720px] mx-auto px-[10vw] box-content">
      <UButtonGroup size="xs" orientation="horizontal" class="mb-1">
        <UButton
          :color="mode === 'upper' ? 'primary' : 'white'"
          @click="mode = 'upper'"
        >
          大文字
        </UButton>
        <UButton
          :color="mode === 'lower' ? 'primary' : 'white'"
          @click="mode = 'lower'"
        >
          小文字
        </UButton>
      </UButtonGroup>
      <div class="flex flex-wrap">
        <div
          class="h-auto w-[60px] max-w-[16.666667%] leading-none "
          v-for="(char, i) in forelunaChars"
          :key="i"
        >
          <KeyButton
            class="relative w-full h-full"
            :color="
              !!keyword.length && char.meaning.includes(keyword)
                ? 'primary'
                : 'white'
            "
            @click="$emit('input-char', adjustCase(char.char))"
          >
            <div class="text-current">{{ adjustCase(char.char) }}</div>
            <span class="text-2xs leading-3">{{ char.meaning }}</span>
          </KeyButton>
        </div>
        <KeyButton
          class="aspect-square h-auto w-[60px] max-w-[16.666667%] leading-none"
          @click="$emit('input-char', ' ')"
          color="white"
        >
          <div class="text-2xs leading-[1.5]">空白</div>
        </KeyButton>
        <KeyButton
          class="aspect-square h-auto w-[60px] max-w-[16.666667%] leading-none"
          @click="$emit('input-char', '\n')"
          color="white"
        >
          <div class="text-2xs leading-[1.5]">改行</div>
        </KeyButton>
        <KeyButton
          class="aspect-square h-auto w-[60px] max-w-[16.666667%] leading-none"
          @click="$emit('delete-char')"
          color="white"
        >
          <div class="text-2xs leading-[1.5]">←</div>
        </KeyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  keyword: string;
}>();

const { forelunaChars } = useForeluna();

const mode = ref<"upper" | "lower">("upper");
const emit = defineEmits(["input-char", "delete-char"]);

const adjustCase = (str: string) => {
  if (mode.value === "lower") return str.toLowerCase();
  return str.toUpperCase();
};
</script>
