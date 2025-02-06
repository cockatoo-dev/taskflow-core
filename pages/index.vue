<script setup lang="ts">
  let refreshInterval: ReturnType<typeof setTimeout>
  const { data, error, refresh } = useFetch("/api/tasks", {
    method: 'get'
  })
  const searchValue = ref('')
  const showAddTask = ref(false)

  useHead({
    title: 'Taskflow'
  })
  useSeoMeta({
    title: 'Taskflow',
    ogTitle: 'Taskflow',
    description: 'Task tracking for keeping your team coordinated.',
    ogDescription: 'Task tracking for keeping your team coordinated.'
  })

  const displayTasks = computed(() => {
    if (!data.value) {
      return []
    }
    const sorted = [...data.value.tasks]
    sorted.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    const result: typeof sorted = []
    for (const i of sorted) {
      if (
        i.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        i.description.toLowerCase().includes(searchValue.value.toLowerCase())
      ) {
        result.push(i)
      }
    }
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

  const intervalRefresh = () => {
    if (!error.value) {
      refresh()
    }
  }
  onMounted(() => {
    refreshInterval = setInterval(intervalRefresh, 20000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <div>
    <NavBar />
    <main 
      v-if="data"
      class="w-full min-w-80 sm:grid sm:grid-cols-[50%_50%] lg:grid-cols-[67%_33%] 2xl:grid-cols-[75%_25%]"
    >
      <AddTaskModal v-model="showAddTask" /> 
      <div class="w-full h-full">
        <div class="h-10 p-1 grid grid-cols-[1fr_auto]">
          <h2 class="pl-2 pt-0.5 leading-8 text-2xl">Current Tasks</h2>
          <UButton 
            type="button"
            label="Add Task"
            icon="i-heroicons-plus-16-solid"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {showAddTask = true}"
          />
        </div>

        <div class="p-1">
          <label class="sr-only" for="tasks-search">Search for a task. The list of tasks will update automatically.</label>
          <UInput 
            id="tasks-search"
            v-model="searchValue"
            autocomplete="off"
            variant="outline"
            icon="i-heroicons-magnifying-glass-16-solid"
            placeholder="Search for a task..."
            :ui="TEXT_INPUT_UI_OBJECT"
          />
        </div>
        <ul
          v-if="data && data.tasks.length > 0" 
          class="lg:grid lg:grid-cols-2 2xl:grid-cols-3 p-2 lg:p-4 lg:gap-4 max-h-[calc(100vh-11rem)] overflow-y-auto list-none m-0"
        >
          <li 
            v-for="item of displayTasks" 
            :key="item.taskId"
            class="max-lg:pb-2 m-0"
          >
            <TaskListItem
              :task-id="item.taskId"
              :title="item.title"
              :description="item.description"
              :is-complete="item.isComplete"
              :num-deps="item.numDeps"
            />
          </li>
        </ul>
        <div v-else class="pt-8">
          <h3 class="font-bold text-3xl text-center">
            No tasks!
          </h3>
          <p class="text-center">
            Click "Add Task" above to create a task.
          </p>
        </div>
      </div>
      <div class="hidden sm:block w-full max-h-[calc(100vh-3rem)] overflow-y-auto p-1 lg:p-2">
        <div class="p-1 lg:p-2 text-center text-3xl">
          <div v-if="stats.percent < 100">
            <p>
              We're <span class="text-teal-600 dark:text-teal-400">{{ stats.percent }}%</span> of the way there!
            </p>
          </div>
          <div v-else>
            <p class="text-green-600 dark:text-green-400">We've made it. </p>
            <p class="text-green-600 dark:text-green-400">Great work, team!</p>
          </div>
        </div>
        <StatsChart
          :complete="stats.complete"
          :ready="stats.ready"
          :not-ready="stats.notReady"
        />
      </div>
    </main>
    <div v-else-if="error">
      <LoadingError :refresh />
    </div>
    <div v-else class="text-center font-bold text-xl pt-8">
      Loading...
    </div>
  </div>
</template>
