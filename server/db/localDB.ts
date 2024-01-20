import { and, eq, or } from 'drizzle-orm'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { dbInterface } from './dbInterface'
import { deps, tasks } from './schema'

export class db implements dbInterface {
  private _db: BetterSQLite3Database
  constructor() {
    const sqlite = new Database(process.cwd() + '/localDB.db')
    this._db = drizzle(sqlite)
  }

  public isTaskExists = async (id: string) => {
    const dbData = await this._db.select({ tasks: tasks.id })
    .from(tasks)
    .where(eq(tasks.id, id))

    return dbData.length > 0
  }

  public isDepsExist = async (source: string, dest: string) => {
    const dbData = await this._db.select({ id: deps.source })
    .from(deps)
    .where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))

    return dbData.length > 0
  }
  
  public getTask = async (id: string) => {
    return (await this._db.select()
    .from(tasks)
    .where(eq(tasks.id, id)))
  }

  public getTasks = async () => {
    return await this._db.select()
    .from(tasks)
  }

  public addTask = async (id: string, title: string, description: string) => {
    await this._db.insert(tasks)
    .values({ 
      id,
      title,
      description,
      isReady: false,
      isComplete: false
    })
  }

  public editTask = async (id: string, title: string, description: string) => {
    await this._db.update(tasks)
    .set({ title, description })
    .where(eq(tasks.id, id))
  }

  public setTaskComplete = async (id: string, value: boolean) => {
    await this._db.update(tasks)
    .set({ isComplete: value })
    .where(eq(tasks.id, id))
  }

  public setTaskReady = async (id: string, value: boolean) => {
    await this._db.update(tasks)
    .set({ isReady: value })
    .where(eq(tasks.id, id))
  }

  public deleteTask = async (id: string) => {
    await this._db.delete(deps)
    .where(or(
      eq(deps.source, id),
      eq(deps.dest, id)
    ))
    await this._db.delete(tasks)
    .where(eq(tasks.id, id))
  }

  public getDeps = async () => {
    return await this._db.select()
    .from(deps)
  }

  public getDestDeps = async (dest: string) => {
    return await this._db.select()
    .from(deps)
    .where(eq(deps.dest, dest))
  }

  public getSourceDepsInfo = async (source: string) => {
    return await this._db.select({
      id: tasks.id,
      title: tasks.title,
      isComplete: tasks.isComplete,
      isReady: tasks.isReady
    })
    .from(deps)
    .where(eq(deps.source, source))
    .innerJoin(tasks, eq(deps.dest, tasks.id))
  }

  public addDeps = async (source: string, dest: string) => {
    await this._db.insert(deps)
    .values({ source, dest })
  }

  public removeDeps = async (source: string, dest: string) => {
    await this._db.delete(deps).where(and(
      eq(deps.source, source),
      eq(deps.dest, dest)
    ))
  }
}