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
    <h2 class=" py-4 text-black dark:text-white text-4xl font-bold">
      New Task
    </h2>
    <form>
      <div>
        <label
          for="new-title"
          class="block pt-2 text-black dark:text-white font-bold"
        >
          Title (required)
        </label>
        <UInput 
          id="new-title"
          v-model="title"
          required
          autocomplete="off"
          placeholder="Enter a task title here..."
          class="font-bold"
        />
        <p
          class=" h-4 text-right text-xs"
          :class="title.length > 25 ? 'text-red-700 dark:text-red-300' : ''"
        >
          {{ title.length }}/25
        </p>
      </div>
      
      <div>
        <label
          for="new-description"
          class="block pt-2 text-black dark:text-white font-bold"
        >
          Description
        </label>
        <UTextarea 
          id="new-description"
          v-model="description"
          :rows="4"
          autocomplete="off"
          placeholder="Enter a task description here..."
        />
        <p
          class=" h-4 text-right text-xs"
          :class="description.length > 2500 ? 'text-red-700' : ''"
        >
          <span v-if="description.length >= 2250">{{ description.length }}/2500</span>
        </p>
      </div>

      <UButton 
        type="submit"
        label="Create Task"
        icon="i-heroicons-document-plus-16-solid"
        class="font-bold mr-1"
        @click.prevent="submitForm"
      />

      <div
        v-if="formError != ''"
        class="mt-2 px-2 py-1 bg-red-300 dark:bg-red-700 border border-red-700 dark:border-red-300 rounded-md"
      >
        {{ formError }}
      </div>
    </form>
    <p class="pt-4 text-sm text-black dark:text-white">
      Dependencies for this task can be added after the task is created.
    </p>
  </StdContainer>
</template>