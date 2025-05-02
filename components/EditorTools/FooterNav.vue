<template>
  <div class="footer-nav p-1">
    <UContainer class="containe flex items-center p-0">
      <UInput
        v-model="keyword"
        class="shadow-none flex-1 mr-2"
        placeholder="辞書(意味を調べる)"
      />
      <UButtonGroup size="xs" class="mr-2">
        <UButton
          :color="mode === 'hymmnos' ? 'primary' : 'white'"
          @click="
            () => {
              mode = 'hymmnos';
            }
          "
        >
          ヒュ
        </UButton>
        <UButton
          :color="mode === 'arCiela' ? 'primary' : 'white'"
          @click="
            () => {
              mode = 'arCiela';
              toggle = true;
            }
          "
        >
          星語
        </UButton>
        <UButton
          :color="mode === 'foreluna' ? 'primary' : 'white'"
          @click="
            () => {
              mode = 'foreluna';
              toggle = true;
            }
          "
        >
          律史前
        </UButton>
      </UButtonGroup>
      <UButton
        :icon="
          toggle
            ? 'i-heroicons-chevron-double-down'
            : 'i-heroicons-chevron-double-up'
        "
        size="sm"
        color="white"
        square
        variant="solid"
        @click="clickToggle"
      />
    </UContainer>
    <div
      class="panel pt-2"
      :style="{
        'max-height': !toggle ? '0vh' : mode === 'hymmnos' ? '30vh' : '100vh',
        '-ms-overflow-style': mode === 'hymmnos' ? 'auto' : 'none',
        'scrollbar-width': mode === 'hymmnos' ? 'auto' : 'none',
      }"
    >
      <UContainer class="container p-0">
        <FooterNavPanel :keyword="keyword" :mode="mode" />
      </UContainer>
    </div>
    <h1 class="text-xs text-cool-500 text-right mt-1">
      ヒュムノスエディタ by <nuxt-link href="/" class="text-primary">ヒュムノグラム</nuxt-link>
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
  background: rgba(255, 255, 255, 0.9);
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
