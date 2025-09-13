type Shapes = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export const initDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!ctx) return;
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let startX = 0;
  let startY = 0;
  let clicked = false;

  let existingShapes: Shapes[] = [];

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#fff";
    existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    });
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
      });
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(startX, startY, width, height);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    existingShapes.push({
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    });
  });
};
