<template>
  <div class="editor-base">
    <div class="display" v-html="lineHtml"></div>
    <textarea
      class="text"
      v-model="textareaText"
      @input="
        (e) => {
          const textarea = e.target as HTMLTextAreaElement;
          updateText(textarea.value);
        }
      "
    ></textarea>
  </div>
</template>

<script setup lang="ts">
const { changeTextarea, changeCursorPosition, textareaText, lineHtmls } =
  useEditor();

onMounted(() => {
  // ローカルストレージからテキストを取得してテキストエリアにセット
  textareaText.value = localStorage.getItem("hymmnos-text") ?? "";
  updateText(textareaText.value);

  // テキストエリアを取得
  const textarea = document.querySelector("textarea");
  if (!textarea) return;
  // フォーカスする
  textarea.focus();

  // カーソルの位置をコンポーザブルに通知
  document.addEventListener("selectionchange", () => {
    const cursorPosition = textarea.selectionEnd;
    changeCursorPosition(cursorPosition);
  });
});

const lineHtml = computed(() => lineHtmls.value.join(`\n`) + `\n`);

const updateText = (value: string) => {
  // ローカルストレージに保存
  localStorage.setItem("hymmnos-text", value);
  changeTextarea(value);
};
</script>

<style>
.editor-base {
  position: relative;
  min-height: 100%;
}
.display {
  width: 100%;
  pointer-events: none;
  white-space: pre;
  text-wrap: wrap;
}
.display .selected {
  background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%);
  position: relative;
}
.display .selected::before {
  content: "";
  position: absolute;
  top: 0;
  left: -3px;
  bottom: 0;
  width: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.text {
  outline: none;
  caret-color: black;
  color: rgba(0, 0, 0, 0.05);
  background-color: transparent;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
