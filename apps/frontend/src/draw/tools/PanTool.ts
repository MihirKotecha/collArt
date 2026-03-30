import { Camera } from "../core/Camera";
import { ShapeTool, ShapeType } from "./Tool";

export class PanTool implements ShapeTool {
  private camera: Camera;
  private prevX: number = 0;
  private prevY: number = 0;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  onMouseDown(worldX: number, worldY: number, screenX: number, screenY: number): void {
    this.prevX = screenX;
    this.prevY = screenY;
  }

  onMouseMove(worldX: number, worldY: number, screenX: number, screenY: number): void {
    const dx = screenX - this.prevX;
    const dy = screenY - this.prevY;

    this.camera.pan(dx, dy);

    this.prevX = screenX;
    this.prevY = screenY;
  }

  onMouseUp(worldX: number, worldY: number, screenX: number, screenY: number): ShapeType | null {
    return null; // Pan tool doesn't create shapes
  }
}
