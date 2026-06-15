export class Style {
  constructor(
    public backgroundColor = "#ffffff",
    public borderColor = "",
    public borderWidth = 0,
  ) {}

  apply = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.backgroundColor
    ctx.strokeStyle = this.borderColor
    ctx.lineWidth = this.borderWidth
  }
}
