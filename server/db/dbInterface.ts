export type DBDepsItem = {
  source: string,
  dest: string
}

export type DBDepsTaskInfo = {
  taskId: string,
  title: string,
  numDeps: number,
  isComplete: boolean
}

export type DBTask = {
  taskId: string,
  title: string,
  description: string,
  numDeps: number,
  isComplete: boolean
}

export interface dbInterface {
  
  // Check if a task with the given ID exists
  isTaskExists: (taskId: string) => Promise<boolean>

  // Check if a dependency with the given source and est exists
  isDepsExist: (source: string, dest: string) => Promise<boolean>
  
  // Get (id, title, description, isReady, isComplete) about a specific task
  // Return object should be an array with one item.
  getTask: (taskId: string) => Promise<DBTask[]>

  getTaskPair: (first: string, second: string) => Promise<DBTask[]>

  // Get (id, title, description, isReady, isComplete) about all tasks
  getTasks: () => Promise<DBTask[]>

  getTasksInfo: () => Promise<DBDepsTaskInfo[]>

  // Add a task with initial state isComplete=false numDeps=0
  addTask: (taskId: string, title: string, description: string) => Promise<void>

  // Edit task with the specified ID
  editTask: (taskId: string, title: string, description: string) => Promise<void>

  // Set the complete status of a specified task
  setTaskComplete: (taskId: string, value: boolean) => Promise<void>

  // Set the unsatisfied dependencies of a task
  setTaskNumDeps: (taskId: string, value: number) => Promise<void>

  // Delete a task and all dependencies which contain that task
  deleteTask: (taskId: string) => Promise<void>

  // Get (source, dest) of all dependencies between all tasks.
  getDeps: () => Promise<DBDepsItem[]>

  // Get information about the dependencies (dest) of a task specified by ID (source)
  getSourceDepsInfo: (source: string) => Promise<DBDepsTaskInfo[]>

  // Get information of tasks (source) which have a specified dependency (dest)
  getDestDepsInfo: (dest: string) => Promise<DBDepsTaskInfo[]>

  // Add a dependency between two tasks.
  addDeps: (source: string, dest: string, newDepsNum: number) => Promise<void>

  // Remove a dependency between two tasks.
  removeDeps: (source: string, dest: string, newDepsNum: number) => Promise<void>
  
}