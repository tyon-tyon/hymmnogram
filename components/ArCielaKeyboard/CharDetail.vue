<template>
  <div v-if="char?.char" class="flex w-full">
    <div class="flex flex-col text-center mr-2 char">
      <div class="font-ar-ciela text-5xl mb-1">
        {{ geFontStr(char.char, char.session, char.envelope) }}
      </div>
      <div class="text-sm">
        {{ getCompartmentStr(char.char, char.session, char.envelope) }}
      </div>
    </div>

    <div v-if="char?.char.match(/[^aiueon]/)" class="flex flex-col flex-1">
      <UButtonGroup size="xs" orientation="horizontal" class="mb-1">
        <UButton
          v-for="n in 5"
          class="flex-1 items-center justify-center px-1"
          :color="char.session == n - 1 ? 'primary' : 'white'"
          @click="() => emit('change', { ...char, session: n - 1 })"
        >
          {{ getSessions(char.meanings)[n - 1].join(" ") }}
        </UButton>
      </UButtonGroup>
      <UButtonGroup size="xs" orientation="horizontal">
        <UButton
          v-for="envelope in envelopes"
          class="flex-1 items-center justify-center"
          :color="char.envelope == envelope ? 'primary' : 'white'"
          @click="() => emit('change', { ...char, envelope })"
        >
          {{ envelope }}
        </UButton>
      </UButtonGroup>
    </div>
    <div v-else class="flex-1">
      <UButton
        class="mb-1 mr-1"
        size="xs"
        color="white"
        v-for="meaning in char.meanings"
        :key="meaning"
      >
        {{ meaning }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TArCielaChar } from "~/types";
defineProps<{
  char: TArCielaChar;
}>();

const { getSessions, envelopes, getCompartmentStr, geFontStr } = useArCiela();

const emit = defineEmits(["change"]);
</script>

<style scoped>
.char {
  min-width: 60px;
}
</style>
