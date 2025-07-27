import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMidddleWare } from "./middleware";
import { JWT_TOKEN } from "@repo/backend-common/config";
import { SignInSchema, SignUpSchema } from "@repo/common/types";
import { dbClient } from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }
  try {
    const user = await dbClient.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      },
    });
    console.log("User created:", user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
  const token = jwt.sign(result, JWT_TOKEN);
  res.json({
    token,
  });
});

app.post("/signin", async (req, res) => {
  const userDetails = req.body;
  const result = SignInSchema.safeParse(userDetails);
  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }
  try {
    const user = await dbClient.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user || user.password !== result.data.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ email: user.email }, JWT_TOKEN);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.post("/room", authMidddleWare, (req, res) => {
  res.json({
    roomId: "123",
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000!!");
});
