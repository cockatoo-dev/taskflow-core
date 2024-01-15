<script setup lang="ts">
  const props = defineProps<{
    title: string,
    description: string,
    status: string,
    assigned: string
  }>()

  const bgClass = ref("")
  if (props.status == "completed") {
    bgClass.value = "bg-blue-700"
  } else if (props.status == "ready") {
    bgClass.value = "bg-green-700"
  } else if (props.status == "not ready") {
    bgClass.value = "bg-red-700"
  } else {
    bgClass.value = "border border-black bg-slate-500"
  }

  const isMouseOver = ref(false)
</script>

<template>
  <div 
    class=" w-full h-full rounded-xl p-4" 
    :class="bgClass"
    @mouseenter="() => {isMouseOver = true}"
    @mouseleave="() => {isMouseOver = false}"
  >
    <div class=" text-white text-xs font-bold tracking-wider">
      <p v-if="props.status == 'completed'">
        COMPLETED!
      </p>
      <p v-else-if="props.status == 'ready'">
        READY TO GO!
      </p>
      <p v-else-if="props.status == 'not ready'">
        NOT READY.
      </p>
      <p v-else>
        Task status error!
      </p>
    </div>
    <h3
      class="text-white line-clamp-2 overflow-ellipsis text-3xl font-bold"
      :class="isMouseOver ? 'underline' : ''"
    >
      {{ props.title }}
    </h3>
    <p class=" text-white line-clamp-1 overflow-ellipsis">
      {{ props.description }}
    </p>
  </div>
</template>