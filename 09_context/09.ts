import { TextLoader } from "langchain/document_loaders/fs/text";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
const loader = new TextLoader("09_context/memory.md");
const [doc] = await loader.load();
const chat = new ChatOpenAI();
const { content } = await chat.invoke([
    new SystemMessage(`
        Answer questions as truthfully using the context below and nothing more. If you don't know the answer, say "don't know".
        context###${doc.pageContent}###
    `),
    new HumanMessage(
        "Who is overment?"
    ),
]);

console.log(content);