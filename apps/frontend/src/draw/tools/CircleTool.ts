import { Renderer } from "../core/Renderer";
import { ShapeTool, ShapeType } from "./Tool";
import { EllipseSchemaType } from "@repo/common/types";

export class CircleTool implements ShapeTool {
  private renderer: Renderer;
  private startX: number = 0;
  private startY: number = 0;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  onMouseDown(worldX: number, worldY: number, screenX: number, screenY: number): void {
    this.startX = worldX;
    this.startY = worldY;
  }

  onMouseMove(worldX: number, worldY: number, screenX: number, screenY: number): void {
    const width = worldX - this.startX;
    const height = worldY - this.startY;
    const midX = (worldX + this.startX) / 2;
    const midY = (worldY + this.startY) / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    this.renderer.renderEllipse(midX, midY, Math.abs(radiusX), Math.abs(radiusY));
  }

  onMouseUp(worldX: number, worldY: number, screenX: number, screenY: number): ShapeType | null {
    const width = worldX - this.startX;
    const height = worldY - this.startY;
    const midX = (worldX + this.startX) / 2;
    const midY = (worldY + this.startY) / 2;
    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);
    
    const ellipse: EllipseSchemaType = {
      type: "ellipse",
      x: midX,
      y: midY,
      radiusX,
      radiusY,
      rotation: 0,
      startAngle: 0,
      endAngle: 2 * Math.PI,
    };
    
    return ellipse;
  }
}
