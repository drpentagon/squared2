import cors from "cors"
import express from "express"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createLevel, deleteLevel, getLevel, listLevels, moveLevel, updateLevel } from "./levels"

const root = join(dirname(fileURLToPath(import.meta.url)), "../..")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => res.sendFile(join(root, "index.html")))
app.get("/styles.css", (_req, res) => res.sendFile(join(root, "styles.css")))
app.use("/dist", express.static(join(root, "dist")))
app.use("/fonts", express.static(join(root, "fonts")))

app.get("/api/levels", listLevels)
app.post("/api/levels", createLevel)
app.get("/api/levels/:id", getLevel)
app.put("/api/levels/:id", updateLevel)
app.post("/api/levels/:id/move", moveLevel)
app.delete("/api/levels/:id", deleteLevel)

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(PORT, () => {
  console.log(`squared2 server listening on http://localhost:${PORT}`)
})
