import { tool } from "langchain";
import { z } from "zod";

export const timeTool = tool(
    async ({ timezone }) => {
        const time = new Date().toLocaleString("en-US", {
            timeZone: timezone,
        });

        return `Current time in ${timezone}: ${time}`;
    },
    {
        name: "get_current_time",
        description: "Get the current time in a specific timezone.",
        schema: z.object({
            timezone: z
                .string()
                .describe("IANA timezone, e.g. Asia/Kolkata"),
        }),
    }
);