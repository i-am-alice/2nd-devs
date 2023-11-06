import { TextLoader } from "langchain/document_loaders/fs/text";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {searchDocs} from "./search.ts";
import {Document} from "langchain/document";
const loader = new TextLoader("18_knowledge/knowledge.md");
const [doc] = await loader.load();
const documents = doc.pageContent.split("\n\n").map((content) => {
    return new Document({
        pageContent: content,
    })
});
const query = "Can you write me a function that will generate random number in range for easy_?";
const filtered = searchDocs(documents, query.split(' '));

const chat = new ChatOpenAI();
const { content } = await chat.call([
    new SystemMessage(`Answer questions as truthfully using the context below and nothing more. If you don't know the answer, say "don't know". 
    
    context### 
    ${filtered.map((doc) => doc.pageContent).join('\n\n')} 
    ###`),
    new HumanMessage(
        `${query}`
    ),
]);

console.log(content); /*
function generateRandomNumber($min, $max) {
    return random_int($min, $max);
}
*/