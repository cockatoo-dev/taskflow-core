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

export interface dbInterface {
  
  // Check if a task with the given ID exists
  isTaskExists: (id: string) => Promise<boolean>

  // Check if a dependency with the given source and est exists
  isDepsExist: (source: string, dest: string) => Promise<boolean>
  
  // Get (id, title, description, isReady, isComplete) about a specific task
  // Return object should be an array with one item.
  getTask: (id: string) => Promise<DBTask[]>

  // Get (id, title, description, isReady, isComplete) about all tasks
  getTasks: () => Promise<DBTask[]>

  // Add a task with initial state isReady=false, isComplete=false
  addTask: (id: string, title: string, description: string) => Promise<void>

  // Edit task with the specified ID
  editTask: (id: string, title: string, description: string) => Promise<void>

  // Set the complete status of a specified task
  setTaskComplete: (id: string, value: boolean) => Promise<void>

  // Set the ready status of a specified task
  setTaskReady: (id: string, value: boolean) => Promise<void>

  // Delete a task and all dependencies which contain that task
  deleteTask: (id: string) => Promise<void>

  // Get (source, dest) of all dependencies between all tasks.
  getDeps: () => Promise<DBDepsItem[]>

  // Get information about the dependencies (dest) of a task specified by ID (source)
  getSourceDepsInfo: (source: string) => Promise<DBDepsTaskInfo[]>

  // Get a list of task IDs (source) which have a specified dependency (dest)
  getDestDeps: (dest: string) => Promise<DBDepsItem[]>

  // Add a dependency between two tasks.
  addDeps: (source: string, dest: string) => Promise<void>

  // Remove a dependency between two tasks.
  removeDeps: (source: string, dest: string) => Promise<void>
  
}