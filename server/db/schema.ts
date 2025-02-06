import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable('tasks', {
  taskId: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  numDeps: integer('numDeps').notNull(),
  isComplete: integer('isComplete', { mode: 'boolean' }).notNull()
})

export const deps = sqliteTable('deps', {
  source: text('source').references(() => tasks.taskId).notNull(),
  dest: text('dest').references(() => tasks.taskId).notNull()
}, (t) => {
  return [primaryKey({ columns: [t.source, t.dest]})]
})
