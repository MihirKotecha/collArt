import { JWT_TOKEN } from "@repo/backend-common/config";
import {WsServerMessageSchema} from "@repo/common/types";
import { WebSocketServer, WebSocket } from "ws";
import jwt  from "jsonwebtoken";

interface User {
  id: string;
  ws: WebSocket;
  rooms: string[];
}

const wss = new WebSocketServer({ port: 8080 });

const getUser = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN);
    if (typeof decoded === "string") {
      throw new Error("Invalid token");
    }
    return decoded.userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

const users: User[] = [];

wss.on("connection", (ws,request) => {
  const url = request.url;

  if(!url) {
    return;
  }

  const urlParams = new URLSearchParams(url.split("?")[1]);
  const token = urlParams.get("token");
  const userId = getUser(token || "");

  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  ws.send(`Token received: ${token}`);

  users.push({ id: userId, ws, rooms: [] });
  
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    const result = WsServerMessageSchema.safeParse(message);

    if(!result.success){
      ws.send("Invalid Message Type");
      return;
    }

    if(message.type === "joinRoom") {
      const room = message.room;
      const user = users.find(u => u.ws === ws);
      if (user && !user.rooms.includes(room)) {
        user.rooms.push(room);
        ws.send(`Joined room: ${room}`);
      } else {
        ws.send(`Already in room: ${room}`);
      }
    }

    if(result.data.type === "leaveRoom"){
      const room = result.data.roomId;
      const user = users.find(u => u.ws === ws);

      if(!room){
        ws.send("Room ID is required");
        return;
      }

      if(user && user.rooms.includes(room)){
        user.rooms.filter(id => id === room);
        ws.send(`Left room: ${room}`)        
      }
      else{
        ws.send(`User is not in the room: ${room}`)
      }
    }

    if(result.data.type === "chat"){
      const room = result.data.roomId;
      
    }
  });

});
