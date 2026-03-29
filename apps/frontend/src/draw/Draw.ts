import { Tool } from "@/components/CanvasComponent";
import { getPastDrawings } from "@/lib/apiClient";
import {
  EllipseSchemaType,
  LineSchemaType,
  RectSchemaType,
} from "@repo/common/types";
import { Camera } from "./core/Camera";
import { Renderer } from "./core/Renderer";

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
  private prevX: number = 0;
  private prevY: number = 0;
  private clicked: boolean = false;
  private currTool: Tool = "rect";
  private camera: Camera;
  private renderer: Renderer;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.camera = new Camera();
    this.renderer = new Renderer(this.canvas, this.ctx, this.camera);
    this.init();
    this.intiHandler();
    this.initMouseHandlers();
  }

  async init() {
    this.existingShapes = await getPastDrawings(this.roomId);
    this.renderer.resetCanvas();
    this.renderer.renderExistingShapes(this.existingShapes);
  }

  intiHandler() {
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const shape = JSON.parse(message.chat);
        this.existingShapes.push(shape);
        this.renderer.resetCanvas();
        this.renderer.renderExistingShapes(this.existingShapes);
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.renderer.resetCanvas();
      this.renderer.renderExistingShapes(this.existingShapes);
    });
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.clicked = true;
      const world = this.camera.screenToWorld(e.clientX, e.clientY);
      this.startX = world.x;
      this.startY = world.y;

      if (this.currTool === "pan") {
        this.prevX = e.clientX;
        this.prevY = e.clientY;
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        const world = this.camera.screenToWorld(e.clientX, e.clientY);
        const width = world.x - this.startX;
        const height = world.y - this.startY;
        const midX = (world.x + this.startX) / 2;
        const midY = (world.y + this.startY) / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;
        
        this.renderer.resetCanvas();
        this.renderer.renderExistingShapes(this.existingShapes);
        
        if (this.currTool === "rect")
          this.renderer.renderRect(this.startX, this.startY, width, height);
        else if (this.currTool === "circle") {
          this.renderer.renderEllipse(midX,midY,Math.abs(radiusX),Math.abs(radiusY));
        } else if (this.currTool === "line") {
          this.renderer.renderLine(this.startX, this.startY, world.x, world.y);
        } else if (this.currTool === "pan") {
          const dx = e.clientX - this.prevX;
          const dy = e.clientY - this.prevY;

          this.camera.pan(dx, dy);

          this.prevX = e.clientX;
          this.prevY = e.clientY;

          this.renderer.resetCanvas();
          this.renderer.renderExistingShapes(this.existingShapes);
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.clicked = false;
      const world = this.camera.screenToWorld(e.clientX, e.clientY);
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



  updateTool(tool: Tool) {
    this.currTool = tool;
  }
}
