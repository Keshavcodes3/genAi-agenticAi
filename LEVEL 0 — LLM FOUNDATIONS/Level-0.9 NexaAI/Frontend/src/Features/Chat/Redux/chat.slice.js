import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        activeConversationId: null,
        conversations: [],
        messages: {},
        loading: false,
        streamingConversationId: null,
        error: null,
        isSidebarOpen: false,
    },

    reducers: {
        setActiveConversationId: (state, action) => {
            state.activeConversationId = action.payload;
            state.error = null;
        },

        addConversations: (state, action) => {
            const { convoId, convo, mode = "casual", createdAt, updatedAt } = action.payload;

            const existing = state.conversations.find((c) => c.convoId === convoId);

            if (existing) {
                existing.convo = convo || existing.convo;
                existing.mode = mode || existing.mode;
                existing.createdAt = createdAt || existing.createdAt;
                existing.updatedAt = updatedAt || existing.updatedAt;
                return;
            }

            state.conversations.unshift({
                convoId,
                convo: convo || "New Chat",
                mode,
                createdAt,
                updatedAt,
            });
        },

        setConversations: (state, action) => {
            const uniqueById = new Map();

            action.payload.forEach((conversation) => {
                uniqueById.set(conversation.convoId, {
                    convoId: conversation.convoId,
                    convo: conversation.convo || "New Chat",
                    mode: conversation.mode || "casual",
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                });
            });

            state.conversations = Array.from(uniqueById.values());
        },

        addMessages: (state, action) => {
            const { chatId, message, role } = action.payload;

            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }

            state.messages[chatId].push({
                message,
                role,
            });
        },

        setConversationMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.messages[chatId] = messages;
        },

        appendMessageChunk: (state, action) => {
            const { chatId, chunk, role } = action.payload;

            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }

            const messages = state.messages[chatId];
            const lastMessage = messages[messages.length - 1];

            if (lastMessage && lastMessage.role === role) {
                lastMessage.message.content += chunk;
                return;
            }

            messages.push({
                message: { content: chunk },
                role,
            });
        },

        removeLastMessage: (state, action) => {
            const { chatId, role } = action.payload;
            const messages = state.messages[chatId];

            if (!messages?.length) return;

            const lastMessage = messages[messages.length - 1];
            if (!role || lastMessage.role === role) {
                messages.pop();
            }
        },

        updateConversationMeta: (state, action) => {
            const { convoId, convo, mode, updatedAt } = action.payload;
            const conversation = state.conversations.find((c) => c.convoId === convoId);

            if (!conversation) return;

            if (convo) conversation.convo = convo;
            if (mode) conversation.mode = mode;
            if (updatedAt) conversation.updatedAt = updatedAt;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setStreamingConversationId: (state, action) => {
            state.streamingConversationId = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        deleteConversation: (state, action) => {
            const conversationId = action.payload;

            state.conversations = state.conversations.filter(
                (c) => c.convoId !== conversationId
            );

            delete state.messages[conversationId];

            if (state.activeConversationId === conversationId) {
                state.activeConversationId = null;
            }

            if (state.streamingConversationId === conversationId) {
                state.streamingConversationId = null;
            }
        },

        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const {
    setActiveConversationId,
    addConversations,
    setConversations,
    addMessages,
    appendMessageChunk,
    removeLastMessage,
    updateConversationMeta,
    setConversationMessages,
    setLoading,
    setStreamingConversationId,
    setError,
    deleteConversation,
    setSidebarOpen,
} = chatSlice.actions;

export default chatSlice.reducer;
