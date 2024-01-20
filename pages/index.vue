<script setup lang="ts">
  const { data } = useFetch("/api/test")
  const testDBData = useFetch("/api/tasks")
</script>

<template>
  <div>
    <NavBar />
    <p>Test data: {{ testDBData.data }}</p>
    <main class=" w-full h-[calc(100vh-3rem)] sm:grid sm:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_1fr] 2xl:grid-cols-[3fr_1fr]">
      <div class="w-full h-full overflow-y-auto">
        <div class="lg:grid lg:grid-cols-2 2xl:grid-cols-3 p-2 md:p-4 lg:gap-4">
          <div 
            v-for="item of data" 
            :key="item.id"
            class="max-md:pb-2 md:max-lg:pb-4"
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
      <div class="hidden sm:block w-full h-full overflow-y-auto">
        <p class=" text-center font-bold">
          A chart will appear here soon  (woo!)
        </p>
      </div>
    </main>
  </div>
</template>