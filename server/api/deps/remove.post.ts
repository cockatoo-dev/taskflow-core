import { z } from "zod"

const bodySchema = z.object({
  source: z.string(),
  dest: z.string()
})

export default defineEventHandler(async (e) => {
  const bodyParse = await readValidatedBody(e, (b) => bodySchema.safeParse(b))
  const bodyData = checkParseResult(bodyParse)
  const db = useDB(e)

  const tasksInfo = await db.getTaskPair(bodyData.source, bodyData.dest)
  if (tasksInfo.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "One or more task IDs are invalid."
    })
  }

  let newNum
  if (tasksInfo[0].taskId === bodyData.source) {
    if (tasksInfo[1].isComplete) {
      newNum = tasksInfo[0].numDeps
    } else if (tasksInfo[0].numDeps < 1) {
      newNum = 0
    } else {
      newNum = tasksInfo[0].numDeps - 1
    }
  } else {
    if (tasksInfo[0].isComplete) {
      newNum = tasksInfo[1].numDeps
    } else if (tasksInfo[1].numDeps < 1) {
      newNum = 0
    } else {
      newNum = tasksInfo[1].numDeps - 1
    }
  }

  await db.removeDeps(bodyData.source, bodyData.dest, newNum)
})
