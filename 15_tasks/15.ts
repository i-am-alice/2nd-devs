import { ChatOpenAI } from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {currentDate, parseFunctionCall, rephrase} from "./helper.ts";
import {addTasks, closeTasks, listUncompleted, updateTasks} from "./todoist.ts";
import {addTasksSchema, finishTasksSchema, getTasksSchema, updateTasksSchema} from "./schema";

const model = new ChatOpenAI({modelName: "gpt-4-turbo-preview",}).bind({functions: [getTasksSchema, addTasksSchema, finishTasksSchema, updateTasksSchema]});
const tools: any = {getTasks: listUncompleted, addTasks, closeTasks, updateTasks}
const act = async (query: string) => {
    console.log('User: ', query);
    const tasks = await listUncompleted();
    const conversation = await model.invoke([
        new SystemMessage(`
            Fact: Today is ${currentDate()}
            Current tasks: ###${tasks.map((task: any) => task.content + ' (ID: ' + task.id + ')').join(', ')}###`),
        new HumanMessage(query),
    ]);
    const action = parseFunctionCall(conversation);
    let response = '';
    if (action) {
        console.log(`action: ${action.name}`);
        response = await tools[action.name](action.args.tasks);
        response = await rephrase(response, query);
    } else {
        response = conversation.content;
    }
    console.log(`AI: ${response}\n`);
    return response;
}

await act('I need to write a newsletter about gpt-4 on Monday, can you add it?');
await act('Need to buy milk, add it to my tasks');
await act('Ouh I forgot! Beside milk I need to buy sugar. Update my tasks please.');
await act('Get my tasks again.');