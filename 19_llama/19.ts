import {Ollama} from "langchain/llms/ollama";

const model = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "llama2:70b",
    temperature: 0,
});

const query = `Create a simple red button in Tailwind CSS.`;
const response = await model.predict(`${query}`);
const json = JSON.parse(response.trim());
console.log(`Response:`, json);

