import { z } from "zod"

const bodySchema = z.object({
  source: z.string(),
  dest: z.string()
})

export default defineEventHandler(async (e) => {
  type DepsData = { source: string, dest: string }[]
  
  const getDepsNew = (data: DepsData, source: string) => {
    const deps = []
    for (const d of data) {
      if (d.source === source) {
        deps.push(d)
      }
    }
    return deps;
  }

  const checkCycleNew = (data: DepsData, checked: string[], newSource: string, newDest: string) => {
    const deps = getDepsNew(data, newDest)
    for (const item of deps) {
      if (item.dest === newSource) {
        return true
      } else if (!checked.includes(item.dest)) {
        if (checkCycleNew(data, checked, newSource, item.dest)) {
          return true
        } else {
          checked.push(item.dest)
        }
      }
    }
    return false
  }

  const checkCycle = (data: DepsData, newSource: string, newDest: string) => {
    return checkCycleNew(data, [], newSource, newDest)
  }
  
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
      newNum = 1
    } else {
      newNum = tasksInfo[0].numDeps + 1
    }
  } else {
    if (tasksInfo[0].isComplete) {
      newNum = tasksInfo[1].numDeps
    } else if (tasksInfo[1].numDeps < 1) {
      newNum = 1
    } else {
      newNum = tasksInfo[1].numDeps + 1
    }
  }
  
  const depsList = await db.getDeps()

  if (checkCycle(depsList, bodyData.source, bodyData.dest)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot create a circular dependency."
    })
  }

  await db.addDeps(bodyData.source, bodyData.dest, newNum)
})
