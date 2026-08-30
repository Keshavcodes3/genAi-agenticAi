import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
const miraModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-3.5-flash",
    temperature: 0.7,
    maxRetries: 2,
})

export const miraChatModel = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0,
    maxRetries: 2
})

export const mistraChatGenerator = miraChatModel;

export default miraModel