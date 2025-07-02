import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected to ws server on port 8080!!");
  ws.on("message", (data) => {
    ws.send("Connected to the Web Socket Server!!");
  });
});
