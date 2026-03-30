import { Renderer } from "../core/Renderer";
import { ShapeTool, ShapeType } from "./Tool";
import { RectSchemaType } from "@repo/common/types";

export class RectTool implements ShapeTool {
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
    this.renderer.renderRect(this.startX, this.startY, width, height);
  }

  onMouseUp(worldX: number, worldY: number, screenX: number, screenY: number): ShapeType | null {
    const width = worldX - this.startX;
    const height = worldY - this.startY;
    
    // Create the final shape
    const shape: RectSchemaType = {
      type: "rect",
      x: this.startX,
      y: this.startY,
      width,
      height,
    };
    
    return shape;
  }
}
