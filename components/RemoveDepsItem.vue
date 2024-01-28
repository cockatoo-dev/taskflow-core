<script setup lang="ts">
  const props = defineProps<{
    id: string,
    title: string,
    isComplete: boolean,
    numDeps: number,
  }>()

  const bgClass = computed(() => {
    if (props.isComplete) {
      return 'bg-green-700 dark:bg-green-300'
    } else if (props.numDeps <= 0) {
      return 'bg-blue-700 dark:bg-blue-300'
    } else {
      return 'bg-red-700 dark:bg-red-300'
    }
  })
</script>

<template>
  <div
    class="w-full px-2 py-1 text-white dark:text-black line-clamp-1 overflow-ellipsis rounded drop-shadow"
    :class="bgClass"
  >
    {{ props.title }}
  </div>
</template>