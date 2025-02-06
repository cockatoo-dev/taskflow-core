import { z } from "zod"

const bodySchema = z.object({
  title: z.string(),
  description: z.string()
})

export default defineEventHandler(async (e) => {
  const id = crypto.randomUUID()

  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  const db = useDB(e)

  if (bodyData.title == '') {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter a task title."
    })
  } else if (bodyData.title.length > 25) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task title is too long."
    })
  } else if (bodyData.description.length > 2500) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task description is too long."
    })
  }

  await db.addTask(id, bodyData.title as string, bodyData.description as string)
  return { taskId: id }
})
