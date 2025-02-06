export default defineEventHandler(async (e) => {
  const db = useDB(e)
  const dbData = await db.getTasksInfo()
  return { tasksInfo: dbData }
})
