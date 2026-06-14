import { Canvas } from "./canvas"
import { GraphicsLayer } from "./graphics-layer"
import { Style } from "./style"

const GRID_SIZE = 92
const SQUARE_SIZE = 7
const CELL_SIZE = 8
const TILES = 13
const TILE_SIZE = 6

const gapStyle = new Style("rgba(255, 255, 255, 0.10)", "", 0)
const tileStyle = new Style("rgba(255, 255, 255, 0.20)", "", 0)

const TILE_PATTERN = ["110", "101", "011"]
const ODD_TILE_PATTERN = ["011", "101", "110"]

export class BackgroundGraphics extends GraphicsLayer {
  protected canvas: Canvas

  constructor() {
    super()
    this.canvas = new Canvas(0)
  }

  update = (_dt: number) => {}

  private fillCells = (
    col: number,
    row: number,
    width: number,
    height: number,
    style: Style,
  ) => {
    const startX = Math.floor((this.canvas.width - GRID_SIZE * CELL_SIZE) / 2)
    const startY = Math.floor((this.canvas.height - GRID_SIZE * CELL_SIZE) / 2)
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        this.canvas.drawSquare(
          startX + (col + c) * CELL_SIZE,
          startY + (row + r) * CELL_SIZE,
          SQUARE_SIZE,
          style,
        )
      }
    }
  }

  private drawTile = (tileRow: number, tileCol: number) => {
    const pattern =
      (tileRow + tileCol) % 2 === 0 ? TILE_PATTERN : ODD_TILE_PATTERN

    for (let localRow = 0; localRow < TILE_SIZE / 2; localRow++) {
      for (let localCol = 0; localCol < TILE_SIZE / 2; localCol++) {
        if (pattern[localRow][localCol] !== "1") continue

        this.fillCells(
          1 + tileCol * 7 + localCol * 2,
          1 + tileRow * 7 + localRow * 2,
          2,
          2,
          tileStyle,
        )
      }
    }
  }

  draw = () => {
    this.fillCells(0, 0, GRID_SIZE, GRID_SIZE, gapStyle)

    for (let tileRow = 0; tileRow < TILES; tileRow++) {
      for (let tileCol = 0; tileCol < TILES; tileCol++) {
        this.drawTile(tileRow, tileCol)
      }
    }
  }
}
