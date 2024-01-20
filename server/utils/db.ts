import { dbInterface } from "../db/dbInterface"
import { db } from "../db/localDB"
import { H3Error } from 'h3'

let _db: dbInterface | undefined

export const useDB = () => {
  if (!_db) {
    _db = new db()
  }
  return _db
}

export const dbErrorHandler = (err: any) => {
  if (err instanceof H3Error) {
    throw err
  }
  
  if (err instanceof Error) {
    console.log(err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error:\n${err.message}`
    })
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: "Database error"
    })
  }
}