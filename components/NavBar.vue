<template>
  <div>
    <nav class=" bg-teal-500 h-12 w-full flex">
      <NuxtLink 
        to="/" 
        class="flex focus-visible:outline-1 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100" 
        aria-label="Link to homepage"
      >
        <div class="p-2">
          <img src="/logo-light.webp" alt="Taskflow logo" class="block dark:hidden h-8">
          <img src="/logo-dark.webp" alt="Taskflow logo" class="hidden dark:block h-8">
        </div>
        
        <div class="block text-slate-100 dark:text-slate-900 py-2 pr-2 text-2xl font-bold">
          Taskflow 
        </div>
      </NuxtLink>
    </nav>
  </div>
</template>
