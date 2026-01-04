import { Tool } from "@/components/CanvasComponent";
import { getPastDrawings } from "@/lib/apiClient";
import {
  EllipseSchemaType,
  LineSchemaType,
  RectSchemaType,
} from "@repo/common/types";

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private existingShapes: (
    | RectSchemaType
    | EllipseSchemaType
    | LineSchemaType
  )[];
  private socket: WebSocket;
  private startX: number = 0;
  private startY: number = 0;
  private viewPortTransform: any = { x: 0, y: 0, scale: 1 };
  private prevX: number = 0;
  private prevY: number = 0;
  private clicked: boolean = false;
  private currTool: Tool = "rect";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.init();
    this.intiHandler();
    this.initMouseHandlers();
  }

  async init() {
    this.existingShapes = await getPastDrawings(this.roomId);
    this.clearCanvas();
  }

  intiHandler() {
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const shape = JSON.parse(message.chat);
        this.existingShapes.push(shape);
        this.clearCanvas();
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.clearCanvas();
    });
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.clicked = true;
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.startX = world.x;
      this.startY = world.y;

      if (this.currTool === "pan") {
        this.prevX = e.clientX;
        this.prevY = e.clientY;
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const width = world.x - this.startX;
        const height = world.y - this.startY;
        const midX = (world.x + this.startX) / 2;
        const midY = (world.y + this.startY) / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;
        this.clearCanvas();
        if (this.currTool === "rect")
          this.ctx.strokeRect(this.startX, this.startY, width, height);
        else if (this.currTool === "circle") {
          this.ctx.beginPath();
          this.ctx.ellipse(
            midX,
            midY,
            Math.abs(radiusX),
            Math.abs(radiusY),
            0,
            0,
            2 * Math.PI
          );
          this.ctx.strokeStyle = "#fff";
          this.ctx.stroke();
        } else if (this.currTool === "line") {
          this.ctx.beginPath(), this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(e.clientX, e.clientY);
          this.ctx.strokeStyle = "#fff";
          this.ctx.stroke();
        } else if (this.currTool === "pan") {
          const dx = e.clientX - this.prevX;
          const dy = e.clientY - this.prevY;

          this.viewPortTransform.x += dx;
          this.viewPortTransform.y += dy;

          this.prevX = e.clientX;
          this.prevY = e.clientY;

          this.clearCanvas();
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.clicked = false;
      const world = this.screenToWorld(e.clientX, e.clientY);
      const width = world.x - this.startX;
      const height = world.y - this.startY;
      if (this.currTool === "rect") {
        const shape: RectSchemaType = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width,
          height,
        };
        this.existingShapes.push(shape);
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            chat: JSON.stringify(shape),
          })
        );
      } else if (this.currTool === "circle") {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const midX = (world.x + this.startX) / 2;
        const midY = (world.y + this.startY) / 2;
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
        this.existingShapes.push(ellipse);
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            chat: JSON.stringify(ellipse),
          })
        );
      } else if (this.currTool === "line") {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const line: LineSchemaType = {
          type: "line",
          x: this.startX,
          y: this.startY,
          endX: world.x,
          endY: world.y,
        };
        this.existingShapes.push(line);
        this.socket.send(
          JSON.stringify({
            type: "chat",
            roomId: this.roomId,
            chat: JSON.stringify(line),
          })
        );
      }
    });
  }

  clearCanvas() {
    // 1️⃣ Reset transform → SCREEN SPACE
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 2️⃣ Clear full screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 3️⃣ Draw background (SCREEN SPACE)
    this.ctx.fillStyle = "#000"; // or whatever bg you want
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 4️⃣ Apply camera transform → WORLD SPACE
    this.ctx.setTransform(
      this.viewPortTransform.scale,
      0,
      0,
      this.viewPortTransform.scale,
      this.viewPortTransform.x,
      this.viewPortTransform.y
    );

    // 5️⃣ Draw shapes (WORLD SPACE)
    this.ctx.strokeStyle = "#fff";
    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
      if (shape.type === "ellipse") {
        this.ctx.beginPath();
        this.ctx.ellipse(
          shape.x,
          shape.y,
          shape.radiusX,
          shape.radiusY,
          shape.rotation,
          shape.startAngle,
          shape.endAngle
        );
        this.ctx.stroke();
      }
      if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x, shape.y);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      }
    });
  }

  updateTool(tool: Tool) {
    this.currTool = tool;
  }

  screenToWorld(x: number, y: number) {
    return {
      x: (x - this.viewPortTransform.x) / this.viewPortTransform.scale,
      y: (y - this.viewPortTransform.y) / this.viewPortTransform.scale,
    };
  }
}
