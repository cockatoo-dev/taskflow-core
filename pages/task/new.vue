<script setup lang="ts">
  const title = ref('')
  const description = ref('')
  const disableSubmit = ref(false)
  const formError = ref('')
  
  const submitForm = async () => {
    disableSubmit.value = true
    if (title.value == '') {
      formError.value = 'Please enter a task title.'
      disableSubmit.value = false
      return
    } else if (title.value.length > 25) {
      formError.value = 'Task title is too long.'
      disableSubmit.value = false
      return
    } else if (description.value.length > 2500) {
      formError.value = 'Task description is too long.'
      disableSubmit.value = false
      return
    }
    const result = await $fetch('/api/task/add', {
      method: 'POST',
      body: {
        title: title.value,
        description: description.value
      }
    })
    
    disableSubmit.value = false
    navigateTo(`/task/${result.id}`)
  }
</script>

<template>
  <StdContainer>
    <BackLink />
    <h2 class=" py-4 text-black text-4xl font-bold">
      New Task
    </h2>
    <form>
      <div>
        <label
          for="new-title"
          class="block pt-2 text-black font-bold"
        >
          Title (required)
        </label>
        <input
          id="new-title"
          v-model="title"
          type="text"
          required
          autocomplete="off"
          class=" w-full px-2 py-1 rounded-md drop-shadow-md bg-teal-200 hover:bg-teal-300 focus:bg-teal-300 text-black text-xl sm:text-2xl font-bold"
        >
        <p
          class=" h-4 text-right text-xs"
          :class="title.length > 25 ? 'text-red-700' : ''"
        >
          {{ title.length }}/25
        </p>
      </div>
      
      <div>
        <label
          for="new-description"
          class="block pt-2 text-black font-bold"
        >
          Description
        </label>
        <textarea
          id="new-description"
          v-model="description"
          rows="4"
          autocomplete="off"
          maxlength="2500"
          class=" w-full px-2 py-1 rounded-md drop-shadow-md bg-teal-200 hover:bg-teal-300 focus:bg-teal-300 text-black"
        />
        <p
          class=" h-4 text-right text-xs"
          :class="description.length > 2500 ? 'text-red-700' : ''"
        >
          <span v-if="description.length >= 225">{{ description.length }}/2500</span>
        </p>
      </div>

      <button
        type="submit"
        class=" block m-0 px-2 py-1 rounded-md drop-shadow-md text-white font-bold bg-teal-700 hover:underline disabled:bg-slate-600 disabled:text-slate-400"
        :disabled="disableSubmit"
        @click.prevent="submitForm"
      >
        Create task
      </button>

      <div
        v-if="formError != ''"
        class="mt-2 px-2 py-1 bg-red-300 border border-red-700 rounded-md"
      >
        {{ formError }}
      </div>
    </form>
    <p class="pt-4">
      Dependencies for this task can be added after the task is created.
    </p>
  </StdContainer>
</template>