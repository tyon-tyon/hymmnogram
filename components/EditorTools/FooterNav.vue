<template>
  <div class="footer-nav overflow-y-auto relative transition-all duration-300 md:h-full md:max-h-[100vh]" :class="{
    'max-h-[68px]': !toggle,
    'max-h-[71vh]': toggle && mode !== 'hymmnos',
    'max-h-[50vh]': toggle && mode === 'hymmnos',
  }">
    <div class="p-2 sticky top-0 z-10 bg-white/90 dark:bg-black/90">
      <AtomH3 class="hidden md:block">入力補助ツール</AtomH3>
      <div class="flex items-center">
        <UInput v-model="keyword" class="shadow-none flex-1 mr-2" :placeholder="mode === 'hymmnos' ? '辞書(意味を調べる)' : '絞り込み' " />
        <UButtonGroup size="xs" class="mr-2">
          <UButton :color="mode === 'hymmnos' ? 'primary' : 'white'" @click="
            () => {
              mode = 'hymmnos';
            }
          ">
            ヒュ
          </UButton>
          <UButton :color="mode === 'arCiela' ? 'primary' : 'white'" @click="
            () => {
              mode = 'arCiela';
              toggle = true;
            }
          ">
            星語
          </UButton>
          <UButton :color="mode === 'foreluna' ? 'primary' : 'white'" @click="
            () => {
              mode = 'foreluna';
              toggle = true;
            }
          ">
            律史前
          </UButton>
        </UButtonGroup>
        <UButton class="md:hidden" :icon="toggle
          ? 'i-heroicons-chevron-double-down'
          : 'i-heroicons-chevron-double-up'
          " size="sm" color="white" square variant="solid" @click="clickToggle" />
      </div>
    </div>
    <div class="px-2">
      <FooterNavPanel v-model:keyword="keyword" :mode="mode" />
    </div>
    <h1 class="text-xs text-cool-500 text-right p-1 sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90">
      ヒュムネエディタ by <nuxt-link to="/" class="text-primary">HYMMNOGRAM</nuxt-link>
    </h1>
  </div>
</template>

<script setup lang="ts">
import FooterNavPanel from "./FooterNavPanel.vue";

const keyword = ref("");
const toggle = ref(false);
const mode = ref<"hymmnos" | "arCiela" | "foreluna">("hymmnos");
const clickToggle = () => {
  toggle.value = !toggle.value;
};

watch(
  () => keyword.value,
  () => {
    toggle.value = true;
    if (mode.value !== "hymmnos") return;

    if (keyword.value.length === 0) {
      toggle.value = false;
    }
  }
);
</script>

<style>
.footer-nav {
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e2e8f0;
  min-height: 10px;
}

.panel {
  transition: 0.3s linear;
  overflow: scroll;
}

.panel-inner {
  height: 100%;
  transition: 0.3s linear;
}

.checkbox div:last-child {
  margin-inline-start: 0.2rem;
}
</style>
