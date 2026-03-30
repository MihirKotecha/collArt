import { Tool } from "@/components/CanvasComponent";
import { getPastDrawings } from "@/lib/apiClient";
import {
  EllipseSchemaType,
  LineSchemaType,
  RectSchemaType,
} from "@repo/common/types";
import { Camera } from "./core/Camera";
import { Renderer } from "./core/Renderer";
import { ShapeTool } from "./tools/Tool";
import { PanTool } from "./tools/PanTool";
import { RectTool } from "./tools/RectTool";
import { CircleTool } from "./tools/CircleTool";
import { LineTool } from "./tools/LineTool";

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
  private isDrawing: boolean = false;
  private currTool: Tool = "rect";
  private camera: Camera;
  private renderer: Renderer;
  private toolMap: Record<string, ShapeTool>;

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
    
    this.toolMap = {
      rect: new RectTool(this.renderer),
      circle: new CircleTool(this.renderer),
      line: new LineTool(this.renderer),
      pan: new PanTool(this.camera),
    };

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
      this.isDrawing = true;
      const world = this.camera.screenToWorld(e.clientX, e.clientY);
      const activeTool = this.toolMap[this.currTool as string];

      if (activeTool) {
        activeTool.onMouseDown(world.x, world.y, e.clientX, e.clientY);
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isDrawing) {
        const world = this.camera.screenToWorld(e.clientX, e.clientY);
        const activeTool = this.toolMap[this.currTool as string];

        this.renderer.resetCanvas();
        this.renderer.renderExistingShapes(this.existingShapes);

        if (activeTool) {
          activeTool.onMouseMove(world.x, world.y, e.clientX, e.clientY);
        }
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.isDrawing = false;
      const world = this.camera.screenToWorld(e.clientX, e.clientY);
      const activeTool = this.toolMap[this.currTool as string];

      if (activeTool) {
        const newShape = activeTool.onMouseUp(world.x, world.y, e.clientX, e.clientY);
        
        if (newShape) {
          this.existingShapes.push(newShape);
          this.socket.send(
            JSON.stringify({
              type: "chat",
              roomId: this.roomId,
              chat: JSON.stringify(newShape),
            })
          );
          
          this.renderer.resetCanvas();
          this.renderer.renderExistingShapes(this.existingShapes);
        }
      }
    });
  }



  updateTool(tool: Tool) {
    this.currTool = tool;
  }
}
