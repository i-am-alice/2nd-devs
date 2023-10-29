import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage} from "langchain/schema";
import {intentSchema} from "./schema";
import {parseFunctionCall} from "./helper.ts";

const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
}).bind({functions: [intentSchema]});

const result = await model.invoke([
    new HumanMessage("Add to my tasks that I need to finish a lesson for AI_Devs course.Add to my tasks that I need to finish a lesson for AI_Devs course.")
]);
const action = parseFunctionCall(result);

console.log(action);