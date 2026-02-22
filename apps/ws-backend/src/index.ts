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
import { UserManager } from "./UserManager";


const wss = new WebSocketServer({ port: 8080 });
const userManager = UserManager.getInstance();

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

  userManager.addUser(ws, userId);

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
        userManager.joinRoom(ws, result.data.roomId);
        break;
      case "leaveRoom":
        userManager.leaveRoom(ws, result.data.roomId);
        break;
      case "chat":
        userManager.broadcast(ws, userId, result.data.roomId, result.data.chat);
        break;
    }
  });
  ws.on("close", () => userManager.removeUser(ws));
});
