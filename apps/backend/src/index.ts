import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authMidddleWare } from "./middleware";
import { JWT_TOKEN } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  SignInSchema,
  SignUpSchema,
} from "@repo/common/types";
import { dbClient, Prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const SALT_ROUNDS = 10;

app.post("/signup", async (req, res) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.flatten() });
  }

  try {
    const { name, email, password } = result.data!;

    // 2. Hash the password for security before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Create the user in the database
    const user = await dbClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_TOKEN);

    res.status(201).json({
      message: "User created successfully!",
      token,
    });
  } catch (error) {
    // Add specific error handling for known database issues
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Check for unique constraint violation (e.g., duplicate email)
      if (error.code === "P2002") {
        res
          .status(409) // 409 Conflict is more appropriate than 400 or 500
          .json({ message: "A user with this email already exists." });
      }
    }

    // Fallback for any other unexpected errors
    console.error("Signup Error:", error); // Use console.error for logging errors
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

app.post("/signin", async (req, res) => {
  // 1. Validate input
  const result = SignInSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ message: "Invalid input", errors: result.error.flatten() });
  }

  try {
    const { email, password } = result.data!;

    const user = await dbClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If passwords don't match, send back the SAME error as user not found
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_TOKEN, { expiresIn: "1d" });

    res.json({
      message: "Signed in successfully!",
      token,
    });
  } catch (error) {
    console.error("Signin Error:", error); // Log the actual error on the server
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

app.post("/room", authMidddleWare, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid room data",
    });
    return;
  }
  //@ts-ignore
  const userId = req.userId;
  console.log("User ID from middleware:", userId);

  try {
    const room = await dbClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.error("Error creating room:", error);
    return;
  }
});

app.get("/rooms", authMidddleWare, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  try {
    const rooms = await dbClient.room.findMany({
      where: {
        adminId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/chat/:roomId", authMidddleWare, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const chatHistory = await dbClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.json({
      chats: chatHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000!!");
});
