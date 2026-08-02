import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/tower_dev',
  },
  verbose: true,
  strict: true,
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
})
