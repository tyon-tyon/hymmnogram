<template>
  <div
    class="flex flex-col flex-none max-width-content"
    :class="{
      'flex-1 min-height-70 pb-1': !small,
      'text-center': !japanese,
    }"
  >
    <!--通常-->
    <slot v-if="!japanese"></slot>
    <!--日本語-->
    <slot v-else name="japanese">
      <div
        v-if="!small"
        class="text-ms text-cool-400"
        :class="{
          'text-sm': !small,
          'text-2xs': small,
        }"
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
}>();
</script>

<style scoped>
.min-height-70 {
  min-height: 70px;
}
</style>
