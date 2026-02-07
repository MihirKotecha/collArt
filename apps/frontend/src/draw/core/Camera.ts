export class Camera {
  x: number;
  y: number;
  scale: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.scale = 1;
  }

  pan(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - this.x) / this.scale,
      y: (y - this.y) / this.scale,
    };
  }
}
