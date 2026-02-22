import { WebSocket } from "ws";
import { addToQueue } from "@repo/queue/queue";

export interface UserMetadata {
  id: string;
  rooms: Set<string>;
}

export class UserManager {
  private static instance: UserManager;
  
  private users: Map<WebSocket, UserMetadata> = new Map();
  private rooms: Map<string, Set<WebSocket>> = new Map();

  private constructor() {}

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(ws: WebSocket, userId: string) {
    this.users.set(ws, { id: userId, rooms: new Set() });
  }

  public removeUser(ws: WebSocket) {
    const user = this.users.get(ws);
    if (user) {
      // Remove user from all rooms they were in
      user.rooms.forEach((roomId) => {
        this.rooms.get(roomId)?.delete(ws);
      });
      this.users.delete(ws);
    }
  }

  public joinRoom(ws: WebSocket, roomId: string) {
    const user = this.users.get(ws);
    if (!user) return;

    user.rooms.add(roomId);
    
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(ws);
    ws.send(`Joined room: ${roomId}`);
  }

  public leaveRoom(ws: WebSocket, roomId: string) {
    const user = this.users.get(ws);
    if (user) {
      user.rooms.delete(roomId);
      this.rooms.get(roomId)?.delete(ws);
      ws.send(`Left room: ${roomId}`);
    }
  }

  public broadcast(ws: WebSocket, userId: string, roomId: string, chat: string) {
    const roomSubscribers = this.rooms.get(roomId);
    
    if (!roomSubscribers) {
      ws.send("Room does not exist or is empty");
      return;
    }

    const message = JSON.stringify({ type: "chat", roomId, chat });

    roomSubscribers.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    addToQueue({ chat, userId, roomId });
  }
}