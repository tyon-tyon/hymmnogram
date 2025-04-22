<template>
  <Layout :breadcrumb-links="[]">
    <SearchPanel />
    <div class="pt-4">
      <Readme />
    </div>
  </Layout>
</template>

<script setup lang="ts">
useHead({
  title: null,
});
</script>
