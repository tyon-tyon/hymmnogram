<template>
  <NuxtPwaManifest />
  <div class="app text-cool-700">
    <span
      class="bg-hymmnos font-hymmnos text-cool-50"
      :style="{ opacity: opacity, transition: transition }"
      >{{ key }}</span
    >
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const key = ref<string>("");
const opacity = ref<number>(0);
const transition = ref<string>("1s");
let timer: NodeJS.Timeout | null = null;
let timer1: NodeJS.Timeout | null = null;
onMounted(() => {
  // キーが押されたら、そのキーを取得してkeyにセット
  window.addEventListener("keydown", (e) => {
    if (timer) clearTimeout(timer);
    if (timer1) clearTimeout(timer1);
    if (e.key.match(/^[a-zA-Z<>\-=\/\.0-9]$/)) {
      key.value = e.key;
      opacity.value = 1;
      transition.value = "0.5s";
    }
    timer = setTimeout(() => {
      opacity.value = 0;
    }, 1000);
    timer1 = setTimeout(() => {
      transition.value = "0s";
    }, 1500);
  });
});
</script>

<style>
.app .bg-hymmnos {
  position: fixed;
  font-size: 100vw;
  bottom: 0;
  right: 0;
  line-height: 1;
  mix-blend-mode: multiply;
  z-index: 10;
  pointer-events: none;
  transition: 1s;
}
</style>
