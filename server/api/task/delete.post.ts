import { z } from "zod"

const bodySchema = z.object({
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  const db = useDB(e)

  const id = bodyData.taskId
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request format"
    })
  }

  await db.deleteTask(id)
})
