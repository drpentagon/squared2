import { Request, Response } from "express"
import { appendToChain, orderedIds, rewriteChain } from "./chain"
import { db } from "./db"

interface LevelRow {
  id: number
  name: string
  data: string
  created_at: string
  updated_at: string
}

export const listLevels = (_req: Request, res: Response) => {
  const rows = db.prepare("SELECT id, name FROM levels").all() as Pick<LevelRow, "id" | "name">[]
  const byId = new Map(rows.map((row) => [row.id, row]))

  res.json(orderedIds().flatMap((id) => byId.get(id) ?? []))
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

  const create = db.transaction(() => {
    const result = db.prepare("INSERT INTO levels (name, data) VALUES (?, ?)").run(name, data)
    const id = Number(result.lastInsertRowid)
    appendToChain(id)
    return id
  })

  res.status(201).json({ id: create() })
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

export const moveLevel = (req: Request, res: Response) => {
  const { direction } = req.body
  if (direction !== "back" && direction !== "forward") {
    res.status(400).json({ error: "direction must be back or forward" })
    return
  }

  const id = Number(req.params.id)
  const ids = orderedIds()
  const index = ids.indexOf(id)
  if (index === -1) {
    res.status(404).json({ error: "Level not found" })
    return
  }

  const target = direction === "back" ? index - 1 : index + 1
  if (target < 0 || target >= ids.length) {
    res.json({ ok: true })
    return
  }

  const moved = [...ids]
  moved[index] = ids[target]
  moved[target] = ids[index]
  rewriteChain(moved)

  res.json({ ok: true })
}

export const deleteLevel = (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const remove = db.transaction(() => {
    const ids = orderedIds()
    if (ids.includes(id)) rewriteChain(ids.filter((other) => other !== id))

    return db.prepare("DELETE FROM levels WHERE id = ?").run(id).changes
  })

  if (remove() === 0) {
    res.status(404).json({ error: "Level not found" })
    return
  }
  res.status(204).send()
}
