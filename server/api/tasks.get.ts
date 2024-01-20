export default defineEventHandler(async () => {
  const db = useDB()
  let complete = 0
  let ready = 0
  let notReady = 0

  try {
    const dbData = await db.getTasks()
    for (const i of dbData) {
      if (i.isComplete) {
        complete += 1
      } else if (i.isReady) {
        ready += 1
      } else {
        notReady += 1
      }
    }
    return {
      tasks: dbData,
      stats: { complete, ready, notReady }
    }
  } catch (err) {
    dbErrorHandler(err)
  }
})
