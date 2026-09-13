import Database from "better-sqlite3"
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const dbPath = fileURLToPath(new URL("../data/squared2.db", import.meta.url))
mkdirSync(dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)
