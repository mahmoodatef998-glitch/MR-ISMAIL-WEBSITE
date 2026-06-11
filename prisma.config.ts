import "dotenv/config"
import { defineConfig } from "prisma/config"

const isProduction = process.env.NODE_ENV === "production"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Production: Neon PostgreSQL
    // Development: local SQLite fallback (not used for migrations)
    url: process.env["DATABASE_URL"] ?? "postgresql://localhost:5432/mr_ismail",
  },
})
