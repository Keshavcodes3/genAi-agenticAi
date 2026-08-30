export interface CreateChatInput {
    userId: string;
    title?: string;
}

export interface UpdateChatInput {
    title?: string;
    archived?: boolean;
}

export interface Chat {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}


export interface SendMessageInput {
    userId: string;
    chatId?: string;
    content: string;
}
