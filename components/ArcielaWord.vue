<template>
  <div
    class="arciela-word"
    :class="{
      'not-small': !small,
    }"
  >
    <div
      class="arciela"
      :class="{
        'text-xl': !small,
      }"
    >
      {{ word }}
    </div>

    <div
      class="text-cool-600 japanese"
      :class="{
        'text-sm': !small,
        'text-2xs': small,
      }"
    >
      {{ chars.map((c) => c.caption).join(", ") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TArcielaCharData } from "~/types";
const { chars } = defineProps<{
  word: string;
  chars: TArcielaCharData[];
  small?: boolean;
}>();
</script>

<style scoped>
.arciela-word {
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
.arciela{
  text-wrap: nowrap;
}
.japanese {
  word-break: keep-all;
  text-wrap: nowrap;
}
</style>
