import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

// Inicjalizacja domyślnego modelu, czyli gpt-3.5-turbo
const chat = new ChatOpenAI();
// Wywołanie modelu poprzez przesłanie tablicy wiadomości.
// W tym przypadku to proste przywitanie
const { content } = await chat.invoke([
    new HumanMessage(
        "Hey there!"
    ),
]);

console.log(content);