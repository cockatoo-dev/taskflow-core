import { z } from "zod"

const bodySchema = z.object({
  taskId: z.string(),
  value: z.boolean()
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
  await db.setTaskComplete(bodyData.taskId, bodyData.value)
})
