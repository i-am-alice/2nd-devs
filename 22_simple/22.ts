import {Document} from "langchain/document";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";

const documents = [
    new Document({pageContent: "Adam is a programmer."}),
    new Document({pageContent: "Adam has a dog named Alexa."}),
    new Document({pageContent: "Adam is also a designer."}),
]

const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings()
);

const resultOne = await vectorStore.similaritySearch("What does Adam do?", 2);
console.log(resultOne);