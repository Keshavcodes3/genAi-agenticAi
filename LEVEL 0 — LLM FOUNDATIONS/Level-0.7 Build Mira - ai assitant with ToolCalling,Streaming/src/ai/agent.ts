import { createAgent, tool } from "langchain";
import { timeTool } from "../tools/time.tool.js";
import miraModel from "./model.js";
import searchInternet from "../tools/search.tool.js";
import { readUrl } from "../tools/WebPageReader.tool.js";
import { saveMemoryTool } from "../tools/memory.tool.js";

const miraAi = createAgent({
    model: miraModel,
    tools: [timeTool, searchInternet, readUrl, saveMemoryTool]
})

export default miraAi