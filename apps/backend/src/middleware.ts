import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "@repo/backend-common/config";
import { dbClient } from "@repo/db/client";

export const authMidddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"] || "";

  const decoded = jwt.verify(token, JWT_TOKEN);

  if (decoded && typeof decoded !== "string") {
    try {
      const user = await dbClient.user.findUnique({
        where: { email: decoded.email },
      });
      if (user) {
        //@ts-ignore
        req.userId = user.id;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};
