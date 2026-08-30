import axios from "axios";
import { BASEURL } from "../../API/ApiStore";

const API = axios.create({
    baseURL: `${BASEURL}/api/conversations`,
    withCredentials: true,
});

const readJsonError = async (response, fallback) => {
    try {
        const data = await response.json();
        return data.message || fallback;
    } catch {
        return fallback;
    }
};

const consumeNdjsonStream = async (response, handlers = {}) => {
    if (!response.body) {
        throw new Error("Streaming is not supported by this browser");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let doneSeen = false;

    const handleLine = (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const data = JSON.parse(trimmed);

        if (data.type === "start") {
            handlers.onStart?.(data);
            return;
        }

        if (data.type === "chunk") {
            handlers.onChunk?.(data.text || "");
            return;
        }

        if (data.type === "done") {
            doneSeen = true;
            handlers.onDone?.(data);
            return;
        }

        if (data.type === "error") {
            throw new Error(data.error || "Stream error");
        }
    };

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                handleLine(line);
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            const lines = buffer.split("\n");
            for (const line of lines) {
                handleLine(line);
            }
        }

        if (!doneSeen) {
            throw new Error("Stream ended before completion");
        }
    } finally {
        reader.releaseLock();
    }
};

export const streamStartChat = async (
    { message, mode = "casual" },
    onStart,
    onChunk,
    onDone,
    onError
) => {
    try {
        const response = await fetch(`${BASEURL}/api/conversations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ message, mode }),
        });

        if (!response.ok) {
            throw new Error(await readJsonError(response, "Error starting chat"));
        }

        await consumeNdjsonStream(response, {
            onStart,
            onChunk,
            onDone,
        });
    } catch (err) {
        onError?.(err.message);
    }
};

export const streamTakeFollowUp = async (
    { conversationId, message },
    onChunk,
    onDone,
    onError
) => {
    try {
        const response = await fetch(
            `${BASEURL}/api/conversations/sendMessage/${conversationId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ message }),
            }
        );

        if (!response.ok) {
            throw new Error(await readJsonError(response, "Error sending message"));
        }

        await consumeNdjsonStream(response, {
            onChunk,
            onDone,
        });
    } catch (err) {
        onError?.(err.message);
    }
};

export const createEmptyConversationApi = async ({ mode }) => {
    const response = await API.post("/empty", { mode });
    return response.data;
};

export const updateConversationModeApi = async ({ conversationId, mode }) => {
    const response = await API.patch(`/${conversationId}/mode`, { mode });
    return response.data;
};

export const deleteConversation = async (conversationId) => {
    const response = await API.delete(`/delete/${conversationId}`);
    return response.data;
};

export const getAllConversations = async () => {
    const response = await API.get("/all");
    return response.data;
};

export const getAllMessages = async ({ conversationId }) => {
    const response = await API.get(`/${conversationId}`);
    return response.data;
};

export const getUsageAnalytics = async () => {
    const response = await API.get("/analytics/usage");
    return response.data;
};
