import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {getVectorStore} from "./helpers.ts";

const query = "Do you know the name of Adam's dog?";
const vectorStore = await getVectorStore();
const context = await vectorStore.similaritySearchWithScore(query, 1);

const chat = new ChatOpenAI();
const { content } = await chat.call([
    new SystemMessage(`
        Answer questions as truthfully using the context below and nothing more. If you don't know the answer, say "don't know".
        context###${context?.[0]?.[0].pageContent}###
    `),
    new HumanMessage(query),
]);

console.log(content);