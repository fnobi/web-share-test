import { CanvasPlayer } from "~/lib/useCanvasAgent";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;

const RECT_SIZE = 100;

export default class SampleCanvasElementPlayer implements CanvasPlayer {
  public readonly canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null;

  private angle = 0;

  public constructor() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;
  }

  private render() {
    const { ctx, canvas, angle } = this;
    if (!ctx || !canvas) {
      return;
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = "#ff0000";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle / 180) * Math.PI);
    ctx.fillRect(-RECT_SIZE / 2, -RECT_SIZE / 2, RECT_SIZE, RECT_SIZE);
    ctx.restore();
  }

  public update(delta: number) {
    this.angle += delta * 0.1;
    this.render();
  }

  public resize() {
    const { canvas } = this;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    this.render();
  }

  // eslint-disable-next-line class-methods-use-this
  public dispose() {
    /* do nothing */
  }
}
