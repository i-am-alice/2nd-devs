import {SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";

const chat = new ChatOpenAI();
const query = "Where Jakub works?";
const sources = [
    {name: "Adam (overment)", source: "adam.md"},
    {name: "Jakub (unknow)", source: "jakub.md"},
    {name: "Mateusz (MC)", source: "mateusz.md"}
];
const { content: source } = await chat.call([
    new SystemMessage(`Pick one of the following sources related to the query and return filename and nothing else.
        Sources###
        ${sources.map(s => s.name + " file:" + s.source).join('\n')}
        ###
        Query: ${query}\n\n
        Source file name:
    `),
]);

console.log(source);