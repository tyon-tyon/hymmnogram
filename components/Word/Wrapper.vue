<template>
  <div
    class="flex flex-col flex-none max-width-content"
    :class="{
      'flex-1 min-height-70 pb-1': !small && !lyric,
      'text-center': !japanese,
    }"
  >
    <!--通常-->
    <slot v-if="!japanese"></slot>
    <!--日本語-->
    <slot v-else name="japanese">
      <div
        v-if="!small"
        class="text-cool-500"
      >
        {{ japanese }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  small?: boolean;
  japanese?: string;
  lyric?: boolean;
}>();
</script>

<style scoped>
.min-height-70 {
  min-height: 70px;
}
</style>
