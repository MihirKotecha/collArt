import { Tool } from "@/components/CanvasComponent";
import { getPastDrawings } from "@/lib/apiClient";
import { RectSchemaType } from "@repo/common/types";

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private existingShapes: RectSchemaType[];
  private socket: WebSocket;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private currTool: Tool = "rect";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    console.log('initialized');
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
      console.log('ldksjfioajsodijfi');
      this.clicked = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        console.log('djsfojdio');
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.clearCanvas();
        this.ctx.strokeStyle = "#fff";
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      console.log("triggg");
      this.clicked = false;
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
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
    });
  }

  updateTool(tool: Tool) {
    this.currTool = tool;
  }
}
