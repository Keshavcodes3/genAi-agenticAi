import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { FirstMessageResponse } from "../Prompts/conversation.prompt.js";

let geminiModel;
let groqModel;

const getGroqModel = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing");
    }

    if (!groqModel) {
        groqModel = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.1-8b-instant",
        });
    }

    return groqModel;
};

const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing");
    }

    if (!geminiModel) {
        geminiModel = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey,
        });
    }

    return geminiModel;
};

const asLangChainMessages = ({ messages }) => {
    return messages.map((msg) => {
        if (msg.role === "ai") {
            return new AIMessage(msg.content);
        }

        return new HumanMessage(msg.content);
    });
};

const extractChunkText = (chunk) => {
    const content = chunk?.content ?? chunk?.text ?? "";

    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                return part?.text ?? "";
            })
            .join("");
    }

    return "";
};

const streamModelResponse = async ({ model, messages, mode, res }) => {
    const response = await model.stream([
        new SystemMessage(FirstMessageResponse({ mode })),
        ...asLangChainMessages({ messages }),
    ]);

    let accumulatedText = "";

    for await (const chunk of response) {
        const text = extractChunkText(chunk);
        if (!text) continue;

        accumulatedText += text;
        res.write(JSON.stringify({ type: "chunk", text }) + "\n");
    }

    return accumulatedText;
};

export const generateChatTitle = ({ message }) => {
    const words = message
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .slice(0, 6)
        .join(" ");

    return words || "New chat";
};

export const generateMessageResponse = async ({ messages, res, mode = "casual" }) => {
    try {
        return await streamModelResponse({ model: getGroqModel(), messages, mode, res });
    } catch (groqError) {
        console.error("Groq stream failed, falling back to Gemini:", groqError?.message);
        return await streamModelResponse({ model: getGeminiModel(), messages, mode, res });
    }
};
