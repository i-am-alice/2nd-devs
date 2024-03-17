import { ChatOpenAI } from "langchain/chat_models/openai";
import {ChatPromptTemplate} from "langchain/prompts";
import {context} from './02_context';

// Zwykle do definiowania promptów warto korzystać z template strings
// Tutaj treści zamknięte w klamrach {} są zastępowane przez LangChain konkretnymi wartościami
const systemTemplate = `
As a {role} who answers the questions ultra-concisely using CONTEXT below 
and nothing more and truthfully says "don't know" when the CONTEXT is not enough to give an answer.

context###{context}###
`;


const humanTemplate = "{text}";

// Utworzenie promptu z dwóch wiadomości według podanych szablonów:
const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", humanTemplate],
]);

// Faktyczne uzupełnienie szablonów wartościami
const formattedChatPrompt = await chatPrompt.formatMessages({
    context,
    role: "Senior JavaScript Programmer",
    text: "What is Vercel AI?",
});

// Inicjalizacja domyślnego modelu, czyli gpt-3.5-turbo
const chat = new ChatOpenAI();
// Wykonanie zapytania do modelu
const { content } = await chat.invoke(formattedChatPrompt);

console.log(content);