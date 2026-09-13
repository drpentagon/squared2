import { LevelData } from "./level"

const API_BASE = "http://localhost:3001"

export const fetchLevelIds = async (): Promise<number[]> => {
  const res = await fetch(`${API_BASE}/api/levels`)
  const levels: { id: number }[] = await res.json()
  return levels.map((level) => level.id)
}

export const fetchLevel = async (id: number): Promise<LevelData> => {
  const res = await fetch(`${API_BASE}/api/levels/${id}`)
  return res.json()
}

export const saveLevel = async (id: number, data: LevelData): Promise<void> => {
  await fetch(`${API_BASE}/api/levels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}
