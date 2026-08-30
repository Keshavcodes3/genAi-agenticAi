import type { BaseMessage } from "@langchain/core/messages";
import miraAi from "../../ai/agent.js";

export const aiResponse = async (
    messages: BaseMessage[]
) => {
    const response = await miraAi.invoke({
        messages,
    });
    const lastMessage =
        response.messages[response.messages.length - 1];

    return lastMessage;
};