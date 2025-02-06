import { z } from "zod"

const querySchema = z.object({
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  const db = useDB(e)
  const queryParse = await getValidatedQuery(e, (q) => querySchema.safeParse(q))
  const queryData = checkParseResult(queryParse)

  try {
    const dbTaskData = await db.getTask(queryData.taskId)
    if (dbTaskData.length < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid task ID"
      })
    }
    
    const dbDepsData = await db.getSourceDepsInfo(queryData.taskId)
    return {
      task: dbTaskData[0],
      deps: dbDepsData
    }
  } catch (err) {
    dbErrorHandler(err)
  }
})
