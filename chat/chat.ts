import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {loadMemory} from "./memory.ts";
import {search} from "./rag.ts";
import {getSystemPrompt} from "./prompts.ts";

const answer = async (query: string) => {
    console.log('Loading memory...');
    await loadMemory();
    console.log('Searching...');
    const matches = await search(query, 'memory');
    console.log('Answering...');

    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo-16k',
        temperature: 0.5
    });

    const { content: answer } = await model.call([
        new SystemMessage(getSystemPrompt(matches)),
        new HumanMessage(query),
    ]);
    console.log('Alice: ' + answer);
    return answer;
}

const query = process.argv.slice(2).join(' ');
console.log(`You: ${query}`);
await answer(query);