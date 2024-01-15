export type TaskInfo = {
  id: string,
  title: string,
  description: string,
  isReady: boolean,
  isComplete: boolean
}

export type TaskDepsInfo = {
  id: string,
  title: string,
  isReady: boolean,
  isComplete: boolean
}

export type Task = {
  id: string,
  title: string,
  description: string,
  isComplete: boolean,
  isReady: boolean,
  deps: TaskDepsInfo[]
}

export type DBDepsItem = {
  source: string,
  dest: string
}

export type DBDepsTaskInfo = {
  id: string,
  title: string,
  isReady: boolean,
  isComplete: boolean
}

export type DBTask = {
  id: string,
  title: string,
  description: string,
  isReady: boolean,
  isComplete: boolean
}

export type DBTaskInfo = {
  id: string,
  title: string,
  description: string,
  isReady: boolean,
  isComplete: boolean
}

