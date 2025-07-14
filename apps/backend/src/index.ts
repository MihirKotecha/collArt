import express from "express";
import jwt from "jsonwebtoken";
import { authMidddleWare } from "./middleware";

const app = express();
export const JWT_TOKEN = "123";

app.post('/signup',(req,res) => {
    
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