<script setup lang="ts">
  let refreshInterval: any
  let addDepsLastUpdate = 0
  const route = useRoute()
  const { data, refresh } = useFetch("/api/task/info", {
    params: {
      id: route.params.id
    },
    method: 'get'
  })
  const addDepsFetch = useFetch("/api/tasksInfo", {
    immediate: false
  })

  const localIsComplete = ref(false)
  const completeDisabled = ref(false)
  const isEditing = ref(false)
  const editTitle = ref('')
  const editDescription = ref('')
  const editDisable = ref(false)
  const editError = ref('')
  const addDepsSearch = ref('')
  const addDepsShow = ref(false)
  const addDepsId = ref('')
  const addDepsDisable = ref(true)
  const removeDepsDisable = ref(false)

  watch(data, async () => {
    if (!data || !data.value) {
      return
    }
    localIsComplete.value = data.value.task.isComplete
    editTitle.value = data.value.task.title
    editDescription.value = data.value.task.description

    let num = 0
    for (const i of data.value.deps) {
      if (!i.isComplete) {
        num += 1
      }
    }

    if (data.value.task.numDeps != num) {
      console.log(`numdeps check failed: expected: ${num}, actual: ${data.value.task.numDeps}`)
      await $fetch('/api/task/depscheck', {
        method: 'get',
        params: {
          id: data.value.task.id
        }
      })
      refresh()
    }
  })

  const depsExists = (id: string) => {
    console.log('run depsExists')
    for (const i of data.value?.deps || []) {
      console.log(i.title)
      if (i.id == id) {
        console.log('return true')
        return true
      }
    }
    console.log('return false')
    return false
  }
  
  const addDepsList = computed(() => {
    console.log(`update addDepsList with search value ${addDepsSearch.value}`)
    if (!addDepsFetch.data || !addDepsFetch.data.value) {
      return []
    }

    console.log(addDepsFetch.data.value.tasksInfo)
    const result: typeof addDepsFetch.data.value.tasksInfo = []
    for (const i of addDepsFetch.data.value.tasksInfo) {
      if (
          !depsExists(i.id) &&
          i.id != route.params.id &&
          i.title.includes(addDepsSearch.value)
        ) {
        result.push(i)
      } else {
        console.log(`skipping adding task ${i.title}`)
      }
    }

    result.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    console.log(result)
    return result
  })

  const refreshFn = () => {
    if (isEditing.value) {
      return
    }
    refresh()
  }

  const setComplete = async (value: boolean) => {
    completeDisabled.value = true
    localIsComplete.value = value
    await $fetch('/api/task/complete', {
      method: 'post',
      body: {
        id: route.params.id,
        value: value
      }
    })
    await refresh()
    completeDisabled.value = false
  }
  const deleteTask = async () => {
    await $fetch('/api/task/delete', {
      method: 'delete',
      body: {
        id: route.params.id
      }
    })
    navigateTo('/')
  }
  
  const editSave = async () => {
    editDisable.value = true
    if (editTitle.value == '') {
      editError.value = 'Please enter a task title.'
      editDisable.value = false
      return
    } else if (editTitle.value.length > 25) {
      editError.value = 'Task title is too long.'
      editDisable.value = false
      return
    } else if (editDescription.value.length > 2500) {
      editError.value = 'Task description is too long.'
      editDisable.value = false
      return
    }

    await $fetch('/api/task/edit', {
      method: 'put',
      body: {
        id: route.params.id,
        title: editTitle.value,
        description: editDescription.value
      }
    })
    
    await refresh()
    isEditing.value = false
  }
  const editDiscard = () => {
    isEditing.value = false
    editTitle.value = data.value?.task.title || ''
    editDescription.value = data.value?.task.description || ''
  }

  const addDepsFocus = async () => {
    if (Date.now() - addDepsLastUpdate > 20000) {
      addDepsFetch.refresh()
      addDepsLastUpdate = Date.now()
    }
    addDepsShow.value = true
    addDepsDisable.value = true
    addDepsId.value = ''
  }

  const addDepsSelect = (id: string) => {
    addDepsId.value = id
    addDepsDisable.value = false
  }
  
  const addDepsSubmit = async () => {
    if (!data.value) {
      return
    }
    
    addDepsDisable.value = true
    await $fetch('/api/deps/add', {
      method: 'post',
      body: {
        source: data.value.task.id,
        dest: addDepsId.value,
      }
    })

    addDepsShow.value = false
    addDepsSearch.value = ''
    addDepsId.value = ''
    await refresh()
  }

  const removeDeps = async (id: string) => {
    removeDepsDisable.value = true
    await $fetch('/api/deps/remove', {
      method: 'delete',
      body: {
        source: route.params.id,
        dest: id
      }
    })
    await refresh()
    removeDepsDisable.value = false
  }

  onMounted(() => {
    refreshInterval = setInterval(refreshFn, 20000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <StdContainer>
    <BackLink />
    <div v-if="data">
      <div class="py-4">
        <p
          v-if="localIsComplete"
          class=" block px-4 py-2 rounded-md drop-shadow-md font-bold text-white text-center bg-green-700"
        >
          This task has been completed. Great job!
        </p>
        <p
          v-else-if="data.task.numDeps <= 0"
          class=" block px-4 py-2 rounded-md drop-shadow-md font-bold text-white text-center bg-blue-700"
        >
          This task is ready to be completed. Time to get to work!
        </p>
        <p
          v-else
          class=" block px-4 py-2 rounded-md drop-shadow-md font-bold text-white text-center bg-red-700"
        >
          This task is not ready to be completed. {{ `${data.task.numDeps} ${data.task.numDeps == 1 ? 'task' : 'tasks'}` }} depended on by this task have not been completed yet.
        </p>
      </div>
      
      <div v-if="isEditing">
        <form>
          <div>
            <label
              for="edit-title"
              class="block pt-2 text-black font-bold"
            >
              Title (required)
            </label>
            <input
              id="edit-title"
              v-model="editTitle"
              type="text"
              required
              autocomplete="off"
              class=" w-full px-2 py-1 rounded-md drop-shadow-md bg-teal-200 hover:bg-teal-300 focus:bg-teal-300 text-black text-xl sm:text-2xl font-bold"
            >
            <p
              class=" h-4 text-right text-xs"
              :class="editTitle.length >= 25 ? 'text-red-700' : ''"
            >
              {{ editTitle.length }}/25
            </p>
          </div>
          
          <div>
            <label
              for="edit-description"
              class="block pt-2 text-black font-bold"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              v-model="editDescription"
              rows="4"
              autocomplete="off"
              maxlength="2500"
              class=" w-full px-2 py-1 rounded-md drop-shadow-md bg-teal-200 hover:bg-teal-300 focus:bg-teal-300 text-black"
            />
            <p
              class=" h-4 text-right text-xs"
              :class="editDescription.length >= 2500 ? 'text-red-700' : ''"
            >
              <span v-if="editDescription.length >= 225">{{ editDescription.length }}/2500</span>
            </p>
          </div>

          <div class="text-center">
            <button
              type="submit"
              class=" mx-1 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-green-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
              :disabled="editDisable"
              @click.prevent="editSave"
            >
              Save Changes
            </button>
            <button
              type="button"
              class=" mx-1 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
              @click="editDiscard"
            >
              Discard Changes
            </button>
          </div>
          <div
            v-if="editError != ''"
            class="mt-2 px-2 py-1 bg-red-300 border border-red-700 rounded-md"
          >
            {{ editError }}
          </div>
        </form>
      </div>
      <div v-else>
        <h2 class=" text-3xl text-black font-bold pb-2">
          {{ data.task.title }}
        </h2>

        <div class="text-center pb-2">
          <button
            v-if="!localIsComplete"
            type="button"
            class=" px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-green-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            :disabled="completeDisabled"
            @click="() => setComplete(true)"
          >
            Mark as Completed
          </button>
          <button
            v-else
            type="button"
            class=" px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            :disabled="completeDisabled"
            @click="() => setComplete(false)"
          >
            Mark as Not Completed
          </button>
        </div>

        <MultiLineP
          :text="data.task.description"
          class="pb-2"
        />

        <div class="text-center pt-2">
          <button
            type="button"
            class=" px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            @click="() => isEditing = true"
          >
            Edit Task Details
          </button>
        </div>

        <h3 class="text-xl font-bold text-black">
          Task Dependencies
        </h3>
        <div class="w-full md:grid md:grid-cols-2">
          <div class="md:pr-1">
            <h4 class=" text-black font-bold">
              Current Dependencies
            </h4>

            <div class="w-full max-w-full h-48">
              <div
                v-for="item of data.deps"
                :key="item.id"
                class="grid grid-cols-[1fr_auto]"
              >
                <RemoveDepsItem
                  :id="item.id"
                  :title="item.title"
                  :is-complete="item.isComplete"
                  :num-deps="item.numDeps"
                />
                <div class="pl-1">
                  <button
                    type="button"
                    class=" px-2 py-1 rounded drop-shadow text-white bg-red-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
                    :disabled="removeDepsDisable"
                    @click="() => removeDeps(item.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="md:pl-1">
            <h4 class=" text-black font-bold">
              Add a Dependency
            </h4>
            <input
              v-model="addDepsSearch"
              type="text"
              autocomplete="off"
              placeholder="Enter a task title here"
              class=" w-full px-2 py-1 rounded-md drop-shadow-md bg-teal-200 hover:bg-teal-300 focus:bg-teal-300 text-black"
              @focus="addDepsFocus"
            >
            <div class="h-32 my-1 w-full overflow-y-auto">
              <div v-if="addDepsShow && addDepsFetch.data.value">
                <div
                  v-for="item of addDepsList"
                  :key="item.id"
                  class="p-1"
                  @click="() => addDepsSelect(item.id)"
                >
                  <AddDepsItem
                    :id="item.id"
                    :title="item.title"
                    :is-complete="item.isComplete"
                    :num-deps="item.numDeps"
                    :selected="addDepsId"
                  />
                </div>
              </div>
              <div v-else-if="addDepsShow">
                <p class="pt-12 text-center text-gray-700">
                  Loading tasks...
                </p>
              </div>
              <div v-else>
                <p class="pt-12 text-center text-gray-700">
                  Use the search bar above to search for a task.
                </p>
              </div>
            </div>
            <div>
              <button
                type="button"
                class="mx-1 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
                :disabled="addDepsDisable"
                @click="addDepsSubmit"
              >
                Add Dependency
              </button>
            </div>
          </div>
        </div>

        <div class="text-center pt-2">
          <button
            type="button"
            class=" px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-red-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            @click="deleteTask"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </StdContainer>
</template>