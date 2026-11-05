import { db } from "./db"

const selectWorld = db.prepare("SELECT id FROM worlds ORDER BY id LIMIT 1")
const insertWorld = db.prepare("INSERT INTO worlds (start_level_id) VALUES (NULL)")
const setNext = db.prepare("UPDATE levels SET next_level_id = ? WHERE id = ?")
const setStart = db.prepare("UPDATE worlds SET start_level_id = ? WHERE id = ?")

const selectOrdered = db.prepare(`
  WITH RECURSIVE chain(id, next_level_id, depth) AS (
    SELECT levels.id, levels.next_level_id, 0
      FROM levels
      JOIN worlds ON worlds.start_level_id = levels.id
     WHERE worlds.id = ?
    UNION ALL
    SELECT levels.id, levels.next_level_id, chain.depth + 1
      FROM levels
      JOIN chain ON levels.id = chain.next_level_id
     WHERE chain.depth < (SELECT COUNT(*) FROM levels)
  )
  SELECT id FROM chain ORDER BY depth
`)

export const appendToChain = (id: number) => {
  rewriteChain([...orderedIds(), id])
}

export const rewriteChain = db.transaction((ids: number[]) => {
  const existing = selectWorld.get() as { id: number } | undefined
  const worldId = existing ? existing.id : Number(insertWorld.run().lastInsertRowid)

  ids.forEach((id, index) => setNext.run(ids[index + 1] ?? null, id))
  setStart.run(ids[0] ?? null, worldId)
})

export const orderedIds = (): number[] => {
  const world = selectWorld.get() as { id: number } | undefined
  if (!world) return []

  return (selectOrdered.all(world.id) as { id: number }[]).map((row) => row.id)
}
