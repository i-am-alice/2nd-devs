import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

// Inicjalizacja chatu z włączonym streamingiem
const chat = new ChatOpenAI({
    streaming: true
});

// Wywołanie chatu wraz z funkcją przyjmującą kolejne tokeny składające się na wypowiedź modelu
await chat.invoke([
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