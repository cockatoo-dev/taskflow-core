export default defineEventHandler(async () => {
  const db = useDB()

  try {
    const dbData = await db.getTasks()
    return {
      tasks: dbData,
    }
  } catch (err) {
    dbErrorHandler(err)
  }
})
