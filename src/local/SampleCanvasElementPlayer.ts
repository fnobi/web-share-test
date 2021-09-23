/* eslint-disable no-lone-blocks */
import { px } from "~/lib/cssUtil";
import { CanvasPlayer } from "~/lib/useCanvasAgent";
import Color from "color";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const RECT_SIZE1 = 220;
const RECT_SIZE2 = 350;

const padLeft = (num: number, len: number = 2) => {
  return (new Array(len).join("0") + num).slice(-len);
};

export default class SampleCanvasElementPlayer implements CanvasPlayer {
  public readonly canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null;

  private angle1 = 0;

  private angle2 = 0;

  private squareCanvas: HTMLCanvasElement;

  private squareCtx: CanvasRenderingContext2D | null;

  private clockCanvas: HTMLCanvasElement;

  private clockCtx: CanvasRenderingContext2D | null;

  public constructor() {
    const { canvas, ctx } = SampleCanvasElementPlayer.initCanvas();
    const {
      canvas: squareCanvas,
      ctx: squareCtx
    } = SampleCanvasElementPlayer.initCanvas();
    const {
      canvas: clockCanvas,
      ctx: clockCtx
    } = SampleCanvasElementPlayer.initCanvas();
    this.canvas = canvas;
    this.ctx = ctx;
    this.squareCanvas = squareCanvas;
    this.squareCtx = squareCtx;
    this.clockCanvas = clockCanvas;
    this.clockCtx = clockCtx;
  }

  private static initCanvas() {
    const canvas = window.document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext("2d");
    return { canvas, ctx };
  }

  private render() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) {
      return;
    }

    this.updateClockCanvas();
    this.updateSquareCanvas();

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    this.maskArea(0);
    ctx.drawImage(this.squareCanvas, 0, 0);
    ctx.restore();

    ctx.drawImage(this.clockCanvas, 0, 0);

    ctx.save();
    this.maskArea(1);
    ctx.drawImage(this.squareCanvas, 0, 0);
    ctx.restore();
  }

  private maskArea(offset: number) {
    const { ctx } = this;
    if (ctx) {
      const w = CANVAS_WIDTH / 2;
      const h = CANVAS_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(w * (0 + offset), h * 0);
      ctx.lineTo(w * (1 + offset), h * 0);
      ctx.lineTo(w * (1 + offset), h * 1);
      ctx.lineTo(w * (0 + offset), h * 1);
      ctx.lineTo(w * (0 + offset), h * 0);
      ctx.clip();
    }
  }

  private updateSquareCanvas() {
    const ctx = this.squareCtx;
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      {
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.scale(0.7, 1);
        {
          ctx.save();
          ctx.lineWidth = 15;
          ctx.strokeStyle = new Color("#f00")
            .rotate(this.angle1)
            .rgb()
            .toString();
          ctx.rotate((this.angle1 / 180) * Math.PI);
          ctx.strokeRect(
            -RECT_SIZE1 / 2,
            -RECT_SIZE1 / 2,
            RECT_SIZE1,
            RECT_SIZE1
          );
          ctx.restore();
        }
        {
          ctx.save();
          ctx.lineWidth = 5;
          ctx.strokeStyle = new Color("#f00")
            .rotate(this.angle2)
            .rgb()
            .toString();
          ctx.rotate((this.angle2 / 180) * Math.PI);
          ctx.strokeRect(
            -RECT_SIZE2 / 2,
            -RECT_SIZE2 / 2,
            RECT_SIZE2,
            RECT_SIZE2
          );
          ctx.restore();
        }
        ctx.restore();
      }
    }
  }

  private updateClockCanvas() {
    const clock = this.createClock();
    const ctx = this.clockCtx;
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save();
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = `bold ${px(200)}/1 'Stick No Bills', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText(clock, 10, 10);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(clock, 0, 0);
      ctx.restore();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private createClock() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(num => padLeft(num))
      .join(":");
  }

  public update(delta: number) {
    this.angle1 += delta * 0.1;
    this.angle2 += delta * 0.15;
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
