<script setup lang="ts">
  const props = defineProps<{
    taskId: string,
    title: string,
    description: string,
    isComplete: boolean,
    numDeps: number
  }>()
  
  const bgClass = computed(() => {
    if (props.isComplete) {
      return "bg-green-700 dark:bg-green-300"
    } else if (props.numDeps <= 0) {
      return "bg-blue-700 dark:bg-blue-300"
    } else {
      return "bg-red-700 dark:bg-red-300"
    }
  })

  const isMouseOver = ref(false)
</script>

<template>
  <NuxtLink 
    :to="`/task/${$props.taskId}`"
    class=" block w-full max-w-full rounded-lg drop-shadow-lg lg:rounded-xl lg:drop-shadow-xl p-2 lg:p-4 hover:cursor-pointer" 
    :class="bgClass"
    @mouseenter="() => {isMouseOver = true}"
    @mouseleave="() => {isMouseOver = false}"
  >
    <div class=" text-white dark:text-black text-xs font-bold tracking-wider">
      <p v-if="props.isComplete">
        COMPLETED!
      </p>
      <p v-else-if="props.numDeps <= 0">
        READY TO GO!
      </p>
      <p v-else>
        NOT READY.
      </p>
    </div>
    <h3
      class="text-white dark:text-black line-clamp-1 overflow-ellipsis text-2xl font-bold"
      :class="isMouseOver ? 'underline' : ''"
      :title="$props.title"
    >
      {{ props.title }}
    </h3>
    <p class=" h-12 lg:h-24 text-white dark:text-black line-clamp-2 lg:line-clamp-4 overflow-ellipsis">
      {{ props.description }}
    </p>
  </NuxtLink>
</template>