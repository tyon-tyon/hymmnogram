<template>
  <Layout :breadcrumb-links="[]">
    <ClientOnly>
      <SearchPanel />
    </ClientOnly>
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
