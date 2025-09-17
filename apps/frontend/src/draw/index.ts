import { getPastDrawings } from "@/lib/apiClient";
import { RectSchemaType } from "@repo/common/types";

type Shapes = RectSchemaType;

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) => {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!ctx) return;
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let startX = 0;
  let startY = 0;
  let clicked = false;
  let rectRadius = 20;

  let existingShapes: Shapes[] = await getPastDrawings(roomId);
  clearCanvas(ctx,canvas,existingShapes)

  socket.onmessage = (event) => {
    console.log(event.data);
    const message = JSON.parse(event.data);

    if(message.type === "chat"){
      const shape = JSON.parse(message.chat);
      existingShapes.push(shape);
      clearCanvas(ctx,canvas,existingShapes);
    }
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCanvas(ctx,canvas,existingShapes)
  });

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(ctx,canvas,existingShapes)
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(startX, startY, width, height);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape : RectSchemaType = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    }
    existingShapes.push(shape);

    socket.send(JSON.stringify({
      type : "chat",
      roomId,
      chat : JSON.stringify(shape)
    }))
  });
};

const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  existingShapes: Shapes[]
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
};
