import {
  EllipseSchemaType,
  LineSchemaType,
  RectSchemaType,
} from "@repo/common/types";

export type ShapeType = RectSchemaType | EllipseSchemaType | LineSchemaType;

export interface ShapeTool {
  onMouseDown(
    worldX: number,
    worldY: number,
    screenX: number,
    screenY: number
  ): void;
  onMouseMove(
    worldX: number,
    worldY: number,
    screenX: number,
    screenY: number
  ): void;
  onMouseUp(
    worldX: number,
    worldY: number,
    screenX: number,
    screenY: number
  ): ShapeType | null;
}
