import { RectSchemaType } from "@repo/common/types";
import axios from "axios";

export const getPastDrawings = async (roomId: string): Promise<RectSchemaType[]> => {
  const response = await axios.get(`http://localhost:4000/chat/${roomId}`, {
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjFjYjcxMC04ZDgyLTQ0ZDItOTExYi05OGMxMzgwZTIxNGYiLCJpYXQiOjE3NTcyMzM4ODl9.DAgNaGwZHlgrAbELDOnhuu0NTQcSY2vNEu7m9bAKd5Y", //replace with token before testing
    },
  });

  console.log(response.data.chats);
  const existingShapes = response.data.chats.map((chat:any) => {
    const shapeData = JSON.parse(chat.message);
    return shapeData;
  });

  return existingShapes;
};
