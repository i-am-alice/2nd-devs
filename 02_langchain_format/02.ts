import { ChatOpenAI } from "langchain/chat_models/openai";
import {ChatPromptTemplate} from "langchain/prompts";
import {context} from './02_context';

const systemTemplate = `
As a {role} who answers the questions ultra-concisely using CONTEXT below 
and nothing more and truthfully says "don't know" when the CONTEXT is not enough to give an answer.

context###{context}###
`;
const humanTemplate = "{text}";

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    ["system", systemTemplate],
    ["human", humanTemplate],
]);

const formattedChatPrompt = await chatPrompt.formatMessages({
    context,
    role: "Senior JavaScript Programmer",
    text: "What is Vercel AI?",
});

const chat = new ChatOpenAI();
const { content } = await chat.call(formattedChatPrompt);

console.log(content);