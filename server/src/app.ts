import cors from "cors"
import express from "express"
import { createLevel, deleteLevel, getLevel, listLevels, updateLevel } from "./levels"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/levels", listLevels)
app.post("/api/levels", createLevel)
app.get("/api/levels/:id", getLevel)
app.put("/api/levels/:id", updateLevel)
app.delete("/api/levels/:id", deleteLevel)

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(PORT, () => {
  console.log(`squared2 server listening on http://localhost:${PORT}`)
})
