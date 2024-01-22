<script setup lang="ts">
  let refreshInterval: any
  const route = useRoute()
  const { data, refresh } = useFetch("/api/task/info", {
    params: {
      id: route.params.id
    },
    method: 'get'
  })
  const localIsComplete = ref(false)
  const completeDisabled = ref(false)
  const isEditing = ref(false)
  const editTitle = ref('')
  const editDescription = ref('')
  const editDisable = ref(false)
  const editError = ref('')

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
        <MultiLineP
          :text="data.task.description"
          class="pb-2"
        />

        <div class="text-center">
          <button
            v-if="!localIsComplete"
            type="button"
            class=" m-0 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-green-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            :disabled="completeDisabled"
            @click="() => setComplete(true)"
          >
            Mark as Completed
          </button>
          <button
            v-else
            type="button"
            class=" m-0 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            :disabled="completeDisabled"
            @click="() => setComplete(false)"
          >
            Mark as Not Completed
          </button>
        </div>
        <div class="text-center pt-2">
          <button
            type="button"
            class=" mx-1 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            @click="() => isEditing = true"
          >
            Edit Task
          </button>
          <button
            type="button"
            class=" mx-1 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-red-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
            @click="deleteTask"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </StdContainer>
</template>