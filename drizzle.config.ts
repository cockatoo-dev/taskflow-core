import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.cwd() + '/localDB.db'
  }
})