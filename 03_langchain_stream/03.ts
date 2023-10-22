import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

const chat = new ChatOpenAI({
    streaming: true
});

await chat.call([
    new HumanMessage(
        "Hey there!"
    ),
], {
    callbacks: [
        {
            handleLLMNewToken(token: string) {
                console.log(token);
            },
        },
    ],
});