import { WebSocket } from "ws";
import { addToQueue } from "@repo/queue/queue";

export interface User {
  id: string;
  ws: WebSocket;
  rooms: string[];
}

export function handleJoinRoom(ws: WebSocket, users: User[], data: any) {
  const room = data.roomId;
  const user = users.find(u => u.ws === ws);

  if (room == null) {
    ws.send('Missing room id');
    return;
  }

  if (user && !user.rooms.includes(room)) {
    user.rooms.push(room);
    ws.send(`Joined room: ${room}`);
  } else {
    ws.send(`Already in room: ${room}`);
  }
}

export function handleLeaveRoom(ws: WebSocket, users: User[], data: any) {
  const room = data.roomId;
  const user = users.find(u => u.ws === ws);

  if (!room) {
    ws.send("Room ID is required");
    return;
  }

  if (user && user.rooms.includes(room)) {
    user.rooms = user.rooms.filter(id => id !== room);
    ws.send(`Left room: ${room}`);
  } else {
    ws.send(`User is not in the room: ${room}`);
  }
}

export function handleChat(ws: WebSocket, userId: string, data: any) {
  const room = data.roomId;
  const chat = data.chat;

  if (room == null || chat == null) {
    ws.send('Invalid Content');
    return;
  }

  addToQueue({ chat, userId, roomId: room });
}
