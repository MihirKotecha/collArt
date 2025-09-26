import { Tool } from "@/components/CanvasComponent";
import { getPastDrawings } from "@/lib/apiClient";
import { EllipseSchemaType, RectSchemaType } from "@repo/common/types";

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private existingShapes: (RectSchemaType | EllipseSchemaType)[];
  private socket: WebSocket;
  private startX: number = 0;
  private startY: number = 0;
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
    console.log(this.existingShapes);
    this.clearCanvas();
  }

  intiHandler() {
    this.socket.onmessage = (event) => {
      console.log(event.data);
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const shape = JSON.parse(message.chat);
        this.existingShapes.push(shape);
        this.clearCanvas();
      }
    };

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.clearCanvas();
    });
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.clicked = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const midX = (e.clientX + this.startX) / 2;
        const midY = (e.clientY + this.startY) / 2;
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
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.clicked = false;
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
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
        const midX = (e.clientX + this.startX) / 2;
        const midY = (e.clientY + this.startY) / 2;
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
      }
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "#fff";
    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        if (this.ctx == null) console.log("something");
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
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
      }
    });
  }

  updateTool(tool: Tool) {
    this.currTool = tool;
  }
}
