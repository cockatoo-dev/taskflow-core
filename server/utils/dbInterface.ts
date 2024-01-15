import { DBDepsItem, DBDepsTaskInfo, DBTask } from "./types"

export interface dbInterface {
  init: () => void
  getDepsList: () => DBDepsItem[]
  addDeps: (source: string, dest: string) => void
  removeDeps: (source: string, dest: string) => void
  getTaskS: () => DBTask[]
  addTask: (title: string, description: string) => void
  editTask: (id: string, title: string, description: string) => void
  deleteTask: (id: string) => void
  getTaskDepsInfo: (id: string) => DBDepsTaskInfo[]
}