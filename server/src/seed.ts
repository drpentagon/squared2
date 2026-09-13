import { readFileSync } from "node:fs"
import { db } from "./db"

const levelFiles = ["level0", "level1", "level2"]

const insert = db.prepare("INSERT INTO levels (name, data) VALUES (?, ?)")

for (const file of levelFiles) {
  const json = readFileSync(new URL(`../../src/levels/${file}.json`, import.meta.url), "utf-8")
  const level = JSON.parse(json)
  insert.run(level.name, json)
}

console.log(`Seeded ${levelFiles.length} levels`)
