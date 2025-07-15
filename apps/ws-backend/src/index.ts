import { JWT_TOKEN } from "@repo/backend-common/config";
import { WebSocketServer } from "ws";
import jwt  from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws,request) => {
  const url = request.url;

  if(!url) {
    return;
  }

  const urlParams = new URLSearchParams(url.split("?")[1]);
  const token = urlParams.get("token");
  const decoded = jwt.verify(token || "", JWT_TOKEN);
  
  if(typeof decoded === 'string'){
    ws.close(1008, "Invalid token");
    return;
  }

  if(!decoded || !decoded.userId) {
    ws.close();
    return;
  }

  ws.send(`Token received: ${token}`);

  ws.on("message", (data) => {
    ws.send("Connected to the Web Socket Server!!");
  });
});
