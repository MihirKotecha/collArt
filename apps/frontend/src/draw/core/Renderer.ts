import { EllipseSchemaType, LineSchemaType, RectSchemaType } from "@repo/common/types";
import { Camera } from "./Camera";


type existingShapes = (RectSchemaType | LineSchemaType | EllipseSchemaType)[]

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  camera: Camera;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    camera: Camera
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.camera = camera;
  }

  renderRect(startX: number, startY: number, width: number, height: number) {
    this.ctx.strokeRect(startX, startY, width, height);
  }

  renderEllipse(x: number, y: number, radiusX: number, radiusY: number) {
    this.ctx.beginPath();
    this.ctx.ellipse(
      x,
      y,
      Math.abs(radiusX),
      Math.abs(radiusY),
      0,
      0,
      2 * Math.PI
    );
    this.ctx.strokeStyle = "#fff";
    this.ctx.stroke();
  }

  renderLine(startX: number, startY: number, endX: number, endY: number) {
    this.ctx.beginPath(), this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = "#fff";
    this.ctx.stroke();
  }

  resetCanvas() {
    // 1️⃣ Reset transform → SCREEN SPACE
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 2️⃣ Clear full screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 3️⃣ Draw background (SCREEN SPACE)
    this.ctx.fillStyle = "#000"; // or whatever bg you want
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 4️⃣ Apply camera transform → WORLD SPACE
    this.ctx.setTransform(
      this.camera.scale,
      0,
      0,
      this.camera.scale,
      this.camera.x,
      this.camera.y
    );
  }

  renderExistingShapes(shapes: existingShapes) {
    this.ctx.strokeStyle = "#fff";
    shapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.renderRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "ellipse") {
        this.renderEllipse(shape.x, shape.y, shape.radiusX, shape.radiusY);
      } else if (shape.type === "line") {
        this.renderLine(shape.x, shape.y, shape.endX, shape.endY);
      }
    });
  }
}
