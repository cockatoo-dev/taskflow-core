<script setup lang="ts">
  const { data } = useFetch("/api/test")
</script>

<template>
  <div>
    <NavBar />
    <main class=" w-full h-[calc(100vh-3rem)] border border-red-500 sm:grid sm:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_1fr] 2xl:grid-cols-[3fr_1fr]">
      <div class="w-full h-full border border-green-500 overflow-y-auto">
        <div class="lg:grid lg:grid-cols-2 2xl:grid-cols-3 p-2 lg:gap-2">
          <div 
            v-for="item of data" 
            :key="item.id"
            class="max-lg:pb-2"
          >
            <TaskListItem
              :title="item.title"
              :description="item.description"
              :status="item.status"
              :assigned="item.assignedName || 'Not assigned'"
            />
          </div>
        </div>
      </div>
      <div class="hidden sm:block w-full h-full border border-blue-500 overflow-y-auto"></div>
    </main>
  </div>
</template>