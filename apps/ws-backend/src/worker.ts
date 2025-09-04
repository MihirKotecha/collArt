import { Worker } from "bullmq";
import { dbClient } from "@repo/db/client";

export const chatWorker = new Worker("chat-queue",async(job) => {
    const message = await dbClient.chat.create({
        data : {
            roomId: job.data.roomId,
            message: job.data.chat,
            userId: job.data.userId
        }
    });

    console.log(`message written to db: ${message}`);
}).run();