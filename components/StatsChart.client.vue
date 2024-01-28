<script setup lang="ts">
  const props = defineProps<{
    complete: number,
    ready: number,
    notReady: number
  }>()
  const isDark = useDark()
  import { Doughnut } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Tooltip,
    ArcElement
  } from 'chart.js';

  ChartJS.register(
    ArcElement,
    Tooltip
  );

const statsChartData = computed(() => {
  return {
    datasets: [{
      data: [
        props.complete,
        props.ready,
        props.notReady
      ],
      backgroundColor: [
        isDark.value ? '#86efac' : '#15803d',
        isDark.value ? '#93c5fd' : '#1d4ed8',
        isDark.value ? '#fca5a5' : '#b91c1c'
      ],
      borderWidth: 1,
      borderColor: isDark.value ? '#000000' : '#ffffff'
    }]
  }
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <div class="w-64 h-64 mx-auto my-8">
    <Doughnut
      :data="statsChartData"
      :options="chartOptions"
    />
  </div>
  <div class="w-64 mx-auto text-2xl font-bold text-black dark:text-white">
    <p>
      <span class="text-green-700 dark:text-green-300">{{ $props.complete }}</span> tasks completed
    </p>
    <p>
      <span class="text-blue-700 dark:text-blue-300">{{ $props.ready }}</span> tasks ready
    </p>
    <p>
      <span class="text-red-700 dark:text-red-300">{{ $props.notReady }}</span> tasks not ready
    </p>
  </div>
</template>