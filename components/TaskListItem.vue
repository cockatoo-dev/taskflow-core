<script setup lang="ts">
  const props = defineProps<{
    title: string,
    description: string,
    status: string,
    assigned: string
  }>()

  const bgClass = ref("")
  if (props.status == "completed") {
    bgClass.value = "bg-gradient-to-b from-blue-700 to-blue-800"
  } else if (props.status == "ready") {
    bgClass.value = "bg-gradient-to-b from-green-700 to-green-800"
  } else if (props.status == "not ready") {
    bgClass.value = "bg-gradient-to-b from-red-700 to-red-800"
  } else {
    bgClass.value = "border border-black bg-slate-500"
  }

  const isMouseOver = ref(false)
</script>

<template>
  <div 
    class=" w-full h-full rounded-xl p-2" 
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
      class="text-white line-clamp-2 overflow-ellipsis text-4xl font-bold"
      :class="isMouseOver ? 'underline' : ''"
    >
      {{ props.title }}
    </h3>
    <p class=" text-white line-clamp-1 overflow-ellipsis">
      {{ props.description }}
    </p>
  </div>
</template>