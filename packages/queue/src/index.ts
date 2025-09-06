import { Queue } from "bullmq";

const chatQueue = new Queue('chat-queue');

interface chat {
    userId: string,
    chat: string,
    roomId: string,
}

export const addToQueue = async(chatMessage : chat) => {
    await chatQueue.add('message',chatMessage);
}