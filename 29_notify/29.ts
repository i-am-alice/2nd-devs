import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {getVectorStore} from "./helpers.ts";

const query = "Write a summary of the games by AI_Devs.";
const vectorStore = await getVectorStore();
const context = await vectorStore.similaritySearchWithScore(query, 2);

const chat = new ChatOpenAI({ modelName: "gpt-4" });
const { content: person } = await chat.call([
    new SystemMessage(`
        Assign the task provided by the user to the person who is most likely to complete it based on the context and nothing else.
        Return the lowercase name or "general" if you can't find a match.
        context###${context?.[0]?.[0].pageContent}###
    `),
    new HumanMessage(query),
]);

console.log(`Notify: ${person}`);