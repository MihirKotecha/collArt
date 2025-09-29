import { JWT_TOKEN } from "@repo/backend-common/config";
import { WsServerMessageSchema } from "@repo/common/types";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import {
  User,
  handleJoinRoom,
  handleLeaveRoom,
  handleChat
} from "./chatHandlers";


const wss = new WebSocketServer({ port: 8080 });

function getUser(token: string): string | null {
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

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;

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
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch (e){
      ws.send(`${e}`);
      return;
    }

    const result = WsServerMessageSchema.safeParse(message);
    if (!result.success) {
      ws.send("Invalid Message Type");
      return;
    }

    switch (result.data.type) {
      case "joinRoom":
        handleJoinRoom(ws, users, result.data);
        break;
      case "leaveRoom":
        handleLeaveRoom(ws, users, result.data);
        break;
      case "chat":
        handleChat(ws, userId, result.data,users);
        break;
      default:
        ws.send("Unknown message type");
    }
  });
});
