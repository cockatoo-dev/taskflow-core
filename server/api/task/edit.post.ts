import { z } from "zod"

const bodySchema = z.object({
  taskId: z.string(),
  title: z.string(),
  description: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  const db = useDB(e)

  if (!(await db.isTaskExists(bodyData.taskId))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID"
    })
  }
  await db.editTask(bodyData.taskId, bodyData.title, bodyData.description)
})
