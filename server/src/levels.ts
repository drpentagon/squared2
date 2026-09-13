import { Request, Response } from "express"
import { db } from "./db"

interface LevelRow {
  id: number
  name: string
  data: string
  created_at: string
  updated_at: string
}

export const listLevels = (_req: Request, res: Response) => {
  const rows = db.prepare("SELECT id, name FROM levels ORDER BY id").all() as Pick<
    LevelRow,
    "id" | "name"
  >[]
  res.json(rows)
}

export const getLevel = (req: Request, res: Response) => {
  const row = db.prepare("SELECT * FROM levels WHERE id = ?").get(req.params.id) as
    | LevelRow
    | undefined
  if (!row) {
    res.status(404).json({ error: "Level not found" })
    return
  }
  res.json({ id: row.id, ...JSON.parse(row.data) })
}

export const createLevel = (req: Request, res: Response) => {
  const { name, ...rest } = req.body
  const data = JSON.stringify({ name, ...rest })
  const result = db.prepare("INSERT INTO levels (name, data) VALUES (?, ?)").run(name, data)
  res.status(201).json({ id: result.lastInsertRowid })
}

export const updateLevel = (req: Request, res: Response) => {
  const { name, ...rest } = req.body
  const data = JSON.stringify({ name, ...rest })
  const result = db
    .prepare("UPDATE levels SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?")
    .run(name, data, req.params.id)
  if (result.changes === 0) {
    res.status(404).json({ error: "Level not found" })
    return
  }
  res.json({ ok: true })
}

export const deleteLevel = (req: Request, res: Response) => {
  const result = db.prepare("DELETE FROM levels WHERE id = ?").run(req.params.id)
  if (result.changes === 0) {
    res.status(404).json({ error: "Level not found" })
    return
  }
  res.status(204).send()
}
