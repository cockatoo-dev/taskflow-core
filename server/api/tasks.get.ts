export default defineEventHandler(async (e) => {
  const db = useDB(e)

  const dbData = await db.getTasks()
  return {
    tasks: dbData,
  }
})
