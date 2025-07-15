import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMidddleWare } from "./middleware";
import { JWT_TOKEN } from "@repo/backend-common/config";
import { SignUpSchema } from "@repo/common/types";

const app = express();

app.use(express.json());

app.post('/signup', (req:Request,res:Response) => {
    const result = SignUpSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json(result.error);
        return;
    }
    // Continue with signup logic
});

app.post('/signin',(req,res) => {
    //@ts-ignore
    const userId = req.userId;

    const token = jwt.sign({
        userId
    },JWT_TOKEN)

    res.json(token);
});

app.post('/room',authMidddleWare,(req,res) => {

    res.json({
        roomId: "123"
    })
});

app.listen(4000,() => {
    console.log("Server running on port 3000!!");
});