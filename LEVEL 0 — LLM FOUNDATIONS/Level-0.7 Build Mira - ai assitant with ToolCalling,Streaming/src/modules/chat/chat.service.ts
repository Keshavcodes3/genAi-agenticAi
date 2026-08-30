import { chatRepositary } from "./chat.repo.js";
import { createTitle } from "./chat.utils.js";

export class ChatService {
    private chatRepo = new chatRepositary();

    async generateChat(data: { userId: string; content: string }) {
        const title = await createTitle(data.content);

        const chat = await this.chatRepo.createChat({
            userId: data.userId,
            title: title,
        });

        return {
            chatId: chat._id,
            title: chat.title,
        };
    }
}

export const chatService = new ChatService();
