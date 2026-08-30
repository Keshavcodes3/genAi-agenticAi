import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MemoryModel } from "../modules/memory/memory.model.js";

export const saveMemoryTool = tool(
    async ({
        type,
        content,
        importance,
        confidence,
    }) => {

        console.log("MEMORY REQUEST:", {
            type,
            content,
            importance,
            confidence,
        });


        //TODO: need to add this to db 
        await MemoryModel.create({
            type: type || "fact",
            content,
            importance,
            confidence,
            chatId: ""
        })
        return JSON.stringify({
            type,
            content,
            importance,
            confidence,
        });
    },
    {
        name: "save_memory",

        description: `
Save a useful long-term memory about the user.

Use this ONLY when the information is genuinely useful
in future conversations.

Do not save casual conversation, temporary emotions,
one-time questions, speculation, or information that
is unlikely to remain useful.

Memory should represent stable facts, preferences,
goals, projects, instructions, language preferences,
or interaction style.
`,

        schema: z.object({
            type: z.enum([
                "fact",
                "preference",
                "goal",
                "project",
                "instruction",
                "language",
                "interaction_style",
            ]),

            content: z.string(),

            importance: z
                .number()
                .min(0)
                .max(1),

            confidence: z
                .number()
                .min(0)
                .max(1),
        }),
    }
);