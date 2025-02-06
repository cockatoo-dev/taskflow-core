<script setup lang="ts">
  useHead({
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }]
  })
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
