<script setup>
  const route = useRoute()
  const { data } = useFetch("/api/task/info", {
    params: {
      id: route.params.id
    },
    method: 'get'
  })
</script>

<template>
  <div class=" w-full p-4 sm:w-[640px] mx-auto">
    <p>Task id {{ route.params.id }}</p>
    <BackLink />
    <div v-if="data">
      <h2 class=" text-3xl text-black font-bold py-4">
        {{ data.task.title }}
      </h2>
      <MultiLineP
        :text="data.task.description"
        class="pb-2"
      />
    </div>
  </div>
</template>