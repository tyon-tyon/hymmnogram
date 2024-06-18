<template>
  <div class="language-select">
    <UButton class="button p-1" size="2xs" @click="clickLangageSelectButton">
      {{ languageOptions[modelValue] }}
    </UButton>
    <USelectMenu
      v-model="selected"
      :options="options"
      class="select"
      @change="emit('update:modelValue', modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const options = ["ヒュムノス", "アルシエラ", "律史前月読"];
const selected = ref(props.modelValue);

const languageOptions = {
  [options[0]]: "ヒュム",
  [options[1]]: "星語",
  [options[2]]: "律史前",
  ["その他"]: "その他",
};

const clickLangageSelectButton = () => {
  // ".language-select .select button"をクリックする
  const button = document.querySelector(
    ".language-select .select button"
  ) as HTMLButtonElement;
  if (button) {
    button.click();
  }
};

const emit = defineEmits(["update:modelValue"]);
watch(
  () => selected.value,
  () => {
    emit("update:modelValue", selected.value);
  }
);
watch(
  () => props.modelValue,
  () => {
    selected.value = props.modelValue;
  }
);
</script>

<style>
.language-select button {
  position: relative;
  -ms-writing-mode: tb-rl;
  writing-mode: vertical-rl;
  height: 44px;
}
.language-select .select {
  position: absolute;
  width: 140px;
}
.language-select .select button {
  display: none;
}
</style>
