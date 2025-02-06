import { and, eq, or, asc } from 'drizzle-orm'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import type { dbInterface } from './dbInterface'
import { deps, tasks } from './schema'

export class db implements dbInterface {
  private _db: BetterSQLite3Database
  constructor() {
    const sqlite = new Database(process.cwd() + '/localDB.db')
    this._db = drizzle(sqlite)
  }

  public isTaskExists = async (taskId: string) => {
    const dbData = await this._db.select({ tasks: tasks.taskId })
    .from(tasks)
    .where(eq(tasks.taskId, taskId))
    return dbData.length > 0
  }

  public isDepsExist = async (source: string, dest: string) => {
    const dbData = await this._db.select({ taskId: deps.source })
    .from(deps)
    .where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))
    return dbData.length > 0
  }
  
  public getTask = async (taskId: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(eq(tasks.taskId, taskId)))
  }

  public getTaskPair = async (first: string, second: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(or(
      eq(tasks.taskId, first),
      eq(tasks.taskId, second)
    )))
  }

  public getTasks = async () => {
    return await this._db.select()
    .from(tasks)
    .orderBy(asc(tasks.title))
  }

  public getTasksInfo = async () => {
    return await this._db.select({
      taskId: tasks.taskId,
      title: tasks.title,
      isComplete: tasks.isComplete,
      numDeps: tasks.numDeps
    })
    .from(tasks)
    .orderBy(asc(tasks.title))
  }

  public addTask = async (taskId: string, title: string, description: string) => {
    await this._db.insert(tasks)
    .values({ 
      taskId,
      title,
      description,
      numDeps: 0,
      isComplete: false
    })
  }

  public editTask = async (taskId: string, title: string, description: string) => {
    await this._db.update(tasks)
    .set({ title, description })
    .where(eq(tasks.taskId, taskId))
  }

  public setTaskComplete = async (taskId: string, value: boolean) => {
    await this._db.transaction(async (t) => {
      await t.update(tasks)
      .set({ isComplete: value })
      .where(eq(tasks.taskId, taskId))

      const depsInfo = await t.select({
        taskId: tasks.taskId,
        title: tasks.title,
        numDeps: tasks.numDeps,
        isComplete: tasks.isComplete,
      })
      .from(deps)
      .where(eq(deps.dest, taskId))
      .innerJoin(tasks, eq(deps.source, tasks.taskId))

      for (const i of depsInfo) {
        if (value) {
          if (i.numDeps < 1) {
            await t.update(tasks)
            .set({ numDeps: 0 })
            .where(eq(tasks.taskId, tasks.taskId))
          } else {
            await t.update(tasks)
            .set({ numDeps: i.numDeps - 1 })
            .where(eq(tasks.taskId, tasks.taskId))
          }
        } else {
          if (i.numDeps < 1) {
            await t.update(tasks)
            .set({ numDeps: 1 })
            .where(eq(tasks.taskId, tasks.taskId))
          } else {
            await t.update(tasks)
            .set({ numDeps: i.numDeps + 1 })
            .where(eq(tasks.taskId, tasks.taskId))
          }
        }
      }
    })
  }

  public setTaskNumDeps = async (taskId: string, value: number) => {
    await this._db.update(tasks)
    .set({ numDeps: value })
    .where(eq(tasks.taskId, taskId))
  }

  public deleteTask = async (taskId: string) => {
    await this._db.transaction(async (t) => {
      const depsInfo = await t.select({
        taskId: tasks.taskId,
        num: tasks.numDeps
      })
      .from(deps)
      .where(eq(deps.dest, taskId))
      .innerJoin(tasks, eq(deps.source, tasks.taskId))

      for (const i of depsInfo) {
        let newNum: number
        if (i.num < 1) {
          newNum = 0
        } else {
          newNum = i.num - 1
        }

        await t.update(tasks)
        .set({ numDeps: newNum })
        .where(eq(tasks.taskId, tasks.taskId))
      }
      
      await t.delete(deps)
      .where(or(
        eq(deps.source, taskId),
        eq(deps.dest, taskId)
      ))

      await t.delete(tasks)
      .where(eq(tasks.taskId, taskId))
    })
  }

  public getDeps = async () => {
    return await this._db.select()
    .from(deps)
  }

  public getDestDepsInfo = async (dest: string) => {
    return await this._db.select({
      taskId: tasks.taskId,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.dest, dest))
    .innerJoin(tasks, eq(deps.source, tasks.taskId))
  }

  public getSourceDepsInfo = async (source: string) => {
    return await this._db.select({
      taskId: tasks.taskId,
      title: tasks.title,
      numDeps: tasks.numDeps,
      isComplete: tasks.isComplete,
    })
    .from(deps)
    .orderBy(asc(tasks.title))
    .where(eq(deps.source, source))
    .innerJoin(tasks, eq(deps.dest, tasks.taskId))
  }

  public addDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.transaction(async (t) => {
      await t.insert(deps)
      .values({ source, dest })

      await t.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.taskId, source))
    })
    
  }

  public removeDeps = async (source: string, dest: string, newDepsNum: number) => {
    await this._db.transaction(async (t) => {
      await t.delete(deps)
      .where(and(
        eq(deps.source, source),
        eq(deps.dest, dest)
      ))

      await t.update(tasks)
      .set({ numDeps: newDepsNum })
      .where(eq(tasks.taskId, source))
    })
  }
}