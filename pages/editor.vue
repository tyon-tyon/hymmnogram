<template>
  <HeaderNav />
  <div class="editor">
    <UContainer class="textarea">
      <HymmnosTextArea />
    </UContainer>
    <FooterNav />
  </div>
</template>

<script setup lang="ts">
import HymmnosTextArea from "~/components/EditorTools/HymmnosTextArea.vue";
import HeaderNav from "~/components/EditorTools/HeaderNav.vue";
import FooterNav from "~/components/EditorTools/FooterNav.vue";
</script>

<style scoped>
.editor {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
}
.textarea {
  flex: 1;
  overflow: auto;
  width: 100%;
}
</style>
