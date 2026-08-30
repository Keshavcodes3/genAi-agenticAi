import { mistraChatGenerator } from "../../ai/model.js";
import { chatTitleGeneratorPromot } from "../../ai/prompts.js";
import {
    SystemMessage,
    HumanMessage,
} from "@langchain/core/messages";

export const createTitle = async (firstMessage: string) => {
    const response = await mistraChatGenerator.invoke([
        new SystemMessage(chatTitleGeneratorPromot),
        new HumanMessage(firstMessage)
    ])
    return typeof response.content === "string"
        ? response.content.trim()
        : "";
}