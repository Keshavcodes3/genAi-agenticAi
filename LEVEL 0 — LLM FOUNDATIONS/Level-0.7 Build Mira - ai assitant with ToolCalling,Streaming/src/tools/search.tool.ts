import * as z from "zod"
import { tool } from "langchain"
import { tavily } from "@tavily/core"
import { TavilySearch } from "@langchain/tavily";


const searchInternet = new TavilySearch({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    maxResults: 4,
    topic: "general"
})
export default searchInternet