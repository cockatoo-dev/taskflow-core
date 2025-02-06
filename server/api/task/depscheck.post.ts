import { z } from "zod"

const bodySchema = z.object({
  taskId: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)

  const db = useDB(e)
  const deps = await db.getSourceDepsInfo(bodyData.taskId)
  let num = 0
  for (const i of deps) {
    if (!i.isComplete) {
      num += 1
    }
  }

  await db.setTaskNumDeps(bodyData.taskId, num)
  return { numDeps: num }
})
