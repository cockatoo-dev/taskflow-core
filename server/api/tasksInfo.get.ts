export default defineEventHandler(async () => {
  const db = useDB()
  try {
    const dbData = await db.getTasksInfo()
    return { tasksInfo: dbData }
  } catch (err) {
    dbErrorHandler(err)
  }
})