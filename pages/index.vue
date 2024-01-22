<script setup lang="ts">
  const { data } = useFetch("/api/tasks")

  const sortedTasks = computed(() => {
    if (!data.value) {
      return []
    }
    const result = [...data.value.tasks]
    result.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    return result
  })

  const stats = computed(() => {
    const result = {
      complete: 0,
      ready: 0,
      notReady: 0,
      percent: 0,
    }
    
    if (!data.value) {
      return result
    }
    
    for (const i of data.value.tasks) {
      if (i.isComplete) {
        result.complete += 1
      } else if (i.numDeps <= 0) {
        result.ready += 1
      } else {
        result.notReady += 1
      }
    }
    result.percent = Math.floor(result.complete / data.value.tasks.length * 100)
    return result
  })
</script>

<template>
  <main class=" w-full min-w-80 h-[calc(100vh-4rem)] sm:grid sm:grid-cols-[50%_50%] lg:grid-cols-[67%_33%] 2xl:grid-cols-[75%_25%]">
    <div class="w-full h-full">
      <div class=" h-10 p-1 grid grid-cols-[1fr_auto]">
        <h2 class="pl-2 leading-8 font-bold text-xl">
          Current Tasks
        </h2>
        <NuxtLink
          to="/task/new"
          class=" px-2 rounded-md drop-shadow-md text-white font-bold leading-8 bg-teal-700 hover:underline"
        >
          Add Task
        </NuxtLink>
      </div>
      <ul
        v-if="data && data.tasks.length > 0" 
        class="lg:grid lg:grid-cols-2 2xl:grid-cols-3 p-2 lg:p-4 lg:gap-4 max-h-[calc(100vh-5.5rem)] overflow-y-auto list-none m-0"
      >
        <li 
          v-for="item of sortedTasks" 
          :key="item.id"
          class="max-lg:pb-2 m-0"
        >
          <TaskListItem
            :task-id="item.id"
            :title="item.title"
            :description="item.description"
            :is-complete="item.isComplete"
            :num-deps="item.numDeps"
          />
        </li>
      </ul>
      <div
        v-else
        class=" pt-8"
      >
        <h3 class=" font-bold text-3xl text-center text-black">
          No tasks!
        </h3>
        <p class="text-center text-black">
          Click "Add Task" above to create a task.
        </p>
      </div>
    </div>
    <div class="hidden sm:block w-full h-full overflow-y-auto p-1 lg:p-2 pt-8">
      <div class="p-1 lg:p-2">
        <p
          v-if="stats.percent < 100"
          class=" text-center text-3xl text-black font-bold"
        >
          We're <span class="text-blue-700">{{ stats.percent }}%</span> of the way there!
        </p>
        <p 
          v-else 
          class=" text-center text-3xl text-green-700 font-bold"
        >
          We've made it. Great work, team!
        </p>
      </div>
      
      <p class=" text-center font-bold">
        A chart will appear here soon  (woo!)
      </p>
    </div>
  </main>
</template>