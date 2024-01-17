import { dbInterface } from "../db/dbInterface"
import { db } from "../db/localDB"

let _db: dbInterface | undefined

export const useDB = () => {
  if (!_db) {
    _db = new db()
  }
  return _db
}