import dotenv from 'dotenv';
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "langchain";

async function test() {
    console.log("GROQ_API_KEY exists?", !!process.env.GROQ_API_KEY);
    
    const groqModel = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.1-8b-instant"
    });

    try {
        const response = await groqModel.stream([
            new SystemMessage("You are a helpful assistant."),
            new HumanMessage("Hello!")
        ]);
        
        let text = "";
        for await (const chunk of response) {
            console.log("Chunk:", chunk.content);
            text += chunk.content;
        }
        console.log("Final text:", text);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
