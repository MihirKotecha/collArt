import { RectSchemaType } from "@repo/common/types";
import axios from "axios";

export const getPastDrawings = async (roomId: string): Promise<RectSchemaType[]> => {
  const response = await axios.get(`http://localhost:4000/chat/${roomId}`, {
    withCredentials: true,
  });

  const existingShapes = response.data.chats.map((chat:any) => {
    const shapeData = JSON.parse(chat.message);
    return shapeData;
  });

  return existingShapes;
};
