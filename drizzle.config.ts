import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/infra/database/schema.ts',
  out: './src/server/infra/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
