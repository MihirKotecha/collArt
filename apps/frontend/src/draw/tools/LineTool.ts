import { Renderer } from "../core/Renderer";
import { ShapeTool, ShapeType } from "./Tool";
import { LineSchemaType } from "@repo/common/types";

export class LineTool implements ShapeTool {
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
    this.renderer.renderLine(this.startX, this.startY, worldX, worldY);
  }

  onMouseUp(worldX: number, worldY: number, screenX: number, screenY: number): ShapeType | null {
    const line: LineSchemaType = {
      type: "line",
      x: this.startX,
      y: this.startY,
      endX: worldX,
      endY: worldY,
    };
    
    return line;
  }
}
