import { tavily } from "@tavily/core"
import { z } from "zod";
import { tool } from "langchain";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const readUrl = tool(
    async ({ url }) => {
        return await tvly.extract([url]);
    },
    {
        name: "read_url",
        description: "Extract readable content from a webpage URL.",
        schema: z.object({
            url: z.string().url().describe("The webpage URL to read"),
        }),
    }
);;