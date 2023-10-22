import type {ITools} from "./types.dt";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {BaseMessageChunk, HumanMessage} from "langchain/schema";
import {addSchema, multiplySchema, subtractSchema} from "./schema";
import {parseFunctionCall} from "./helper.ts";
const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
}).bind({functions: [addSchema, multiplySchema, subtractSchema]});

const result = await model.invoke([
    new HumanMessage("2929590 * 129359")
]);
const tools: ITools = {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    multiply: (a: number, b: number) => a * b,
};
const action = parseFunctionCall(result);
if (action && tools[action.name]) {
    const result = tools[action.name](action.args.first, action.args.second);
    console.log(`The result is ${result}`);
} else {
    console.log(result.content);
}


