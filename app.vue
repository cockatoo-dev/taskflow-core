<script setup lang="ts">
  useHead({
    title: "taskflow-core"
  })

  onMounted(() => {
    document.body.classList.add('dark:bg-black')
  })
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
  .dark-mode {
    background-color: black
  }
</style>