export default defineEventHandler(() => {
  return [
    {
      id: "1",
      title: "Test task 1",
      description: "A completed task for testing!",
      status: "completed",
      assignedName: null
    },
    {
      id: "2",
      title: "Test task 2",
      description: "A ready task for testing!",
      status: "ready",
      assignedName: null
    },
    {
      id: "3",
      title: "Test task 3",
      description: "A not ready task for testing!",
      status: "not ready",
      assignedName: null
    },
  ]
})