import * as fs from "fs";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {Document} from "langchain/document";

const VECTOR_STORE_PATH = `21_similarity/memory.index`;
const MEMORY_PATH = "21_similarity/memory.md";

export const getVectorStore = async (): Promise<HNSWLib> => {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
        return HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
    }

    const loader = new TextLoader(MEMORY_PATH);
    let [memory] = await loader.load();
    const documents = memory.pageContent.split("\n\n").map((content) => (new Document({pageContent: content,})));
    const store = await HNSWLib.fromDocuments(documents, new OpenAIEmbeddings());
    await store.save(VECTOR_STORE_PATH);
    return store;
}