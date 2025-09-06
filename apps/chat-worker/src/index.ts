import { Job, RedisOptions, Worker } from "bullmq";
import { dbClient } from "@repo/db/client";

const connection: RedisOptions = {
  host: "localhost",
  port: 6379,
};

export const chatWorker = new Worker(
  'chat-queue',
  async (job: Job) => {
    console.log(`worker working...`);
    const message = await dbClient.chat.create({
      data: {
        roomId: job.data.roomId,
        message: job.data.chat,
        userId: job.data.userId,
      },
    });

    console.log(`message written to db: ${message.message}`);
  },
  { connection }
);