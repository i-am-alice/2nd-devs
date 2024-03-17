import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";

const chat = new ChatOpenAI({ modelName: 'gpt-4' });

const { content: zeroShot } = await chat.invoke([
    new SystemMessage(`Answer the question ultra-briefly:`),
    new HumanMessage(`48*62-9`),
]);

let { content: cot } = await chat.invoke([
    new SystemMessage(`
        Take a deep breath and answer the question by carefully explaining your logic step by step.
        Then add the separator: \n### and answer the question ultra-briefly with a single number:
    `),
    new HumanMessage(`48*62-9`),
]);

if (typeof cot === 'string' && typeof zeroShot === 'string') {
    cot = cot.split("\n###")[1];
    console.log('Zero Shot: ' + parseInt(zeroShot), parseInt(zeroShot) === 2967 ? "Passed" : `Failed 🙁`);
    console.log('Chain of Thought: ' +  parseInt(cot), parseInt(cot) === 2967 ? "Passed" : `Failed 🙁`);
}


