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
    next_level_id INTEGER REFERENCES levels(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS worlds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_level_id INTEGER REFERENCES levels(id)
  )
`)

const columns = db.prepare("PRAGMA table_info(levels)").all() as { name: string }[]
if (!columns.some((column) => column.name === "next_level_id")) {
  db.exec("ALTER TABLE levels ADD COLUMN next_level_id INTEGER REFERENCES levels(id)")
}

const chainExistingLevels = db.transaction(() => {
  const worlds = db.prepare("SELECT COUNT(*) AS count FROM worlds").get() as { count: number }
  if (worlds.count > 0) return

  const ids = (db.prepare("SELECT id FROM levels ORDER BY id").all() as { id: number }[]).map(
    (row) => row.id,
  )
  if (ids.length === 0) return

  const setNext = db.prepare("UPDATE levels SET next_level_id = ? WHERE id = ?")
  ids.forEach((id, index) => setNext.run(ids[index + 1] ?? null, id))

  db.prepare("INSERT INTO worlds (start_level_id) VALUES (?)").run(ids[0])
})

chainExistingLevels()

const DEFAULT_DURATION = 60

const addMissingDurations = db.transaction(() => {
  const rows = db.prepare("SELECT id, data FROM levels").all() as { id: number; data: string }[]
  const update = db.prepare("UPDATE levels SET data = ? WHERE id = ?")

  for (const row of rows) {
    const data = JSON.parse(row.data)
    if (data.duration !== undefined) continue

    update.run(JSON.stringify({ ...data, duration: DEFAULT_DURATION }), row.id)
  }
})

addMissingDurations()
