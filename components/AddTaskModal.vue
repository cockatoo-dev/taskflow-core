<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const title = ref('')
  const description = ref('')
  const disableSubmit = ref(false)
  const errorMessage = ref('')

  const submitForm = async () => {
    if (title.value == '') {
      errorMessage.value = 'Please enter a task title.'
      return
    } else if (title.value.length > 50) {
      errorMessage.value = 'Task ttitle is too long (maximum 50 characters).'
      return
    } else if (description.value.length > 2500) {
      errorMessage.value = 'Task description is too long (maximum 2500 characters).'
      return
    }
    
    disableSubmit.value = true
    try {
      const result = await $fetch('/api/task/add', {
        method: 'POST',
        body: {
          title: title.value,
          description: description.value
        }
      })
      navigateTo(`/task?taskId=${result.taskId}`)
    } catch (e) {
      disableSubmit.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      title.value = ''
      description.value = ''
      disableSubmit.value = false
      errorMessage.value = ''
    }
  })
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <h3 class="text-3xl font-bold pb-2">Add New Task</h3>
      <form @submit.prevent="submitForm">
        <div class="pb-2">
          <label for="add-title" class="block pb-2 font-bold">Title (required)</label>
          <UInput 
            id="add-title"
            v-model="title" 
            required
            autocomplete="off"
            class="block w-full"
            size="lg"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="title" :limit="50" :show-length="40" />
        </div>
        <div class="pb-2">
          <label for="add-description" class="block pb-2 font-bold">Description</label>
          <UTextarea
            id="add-description"
            v-model="description" 
            autocomplete="off"
            class="block w-full"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="description" :limit="2500" :show-length="2250" />
        </div>
        <div class="pb-2">Dependencies for this task can be added after the task is added to the board.</div>
        <div class="flex gap-2 sm:gap-4">
          <div>
            <UButton 
              type="submit"
              label="Add Task"
              icon="i-heroicons-document-plus-16-solid"
              :loading="disableSubmit"
              :ui="BUTTON_UI_OBJECT"
            />
          </div>
          <div>
            <UButton 
              type="button"
              label="Cancel"
              color="red"
              variant="ghost"
              icon="i-heroicons-x-mark-16-solid"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {isVisible = false}"
            />
          </div>
        </div>
      </form>
      <FormError :message="errorMessage" />
    </div>
  </LargeModal>
</template>
