export default defineEventHandler(async (e) => {
  const id = crypto.randomUUID()
  const body = await readBody(e)
  const db = useDB()

  if (!body.title || !body.description) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  try {
    await db.addTask(id, body.title as string, body.description as string)
    return {}
  } catch (err) {
    dbErrorHandler(err)
  }

  
})
