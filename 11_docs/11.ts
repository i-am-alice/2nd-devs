import * as fs from "fs";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {Document} from "langchain/document";
import {HumanMessage, SystemMessage} from "langchain/schema";

const loader = new TextLoader("11_docs/docs.md");
const [doc] = await loader.load();
const documents = doc.pageContent.split("\n\n").map((content) => {
    return new Document({
        pageContent: content,
    })
});
console.log(documents);
const model = new ChatOpenAI({maxConcurrency: 5});
const descriptionPromise = [];

for (const doc of documents) {
    descriptionPromise.push(model.invoke([
        new SystemMessage(`
            Describe the following document with one of the following keywords:
            Mateusz, Jakub, Adam. Return the keyword and nothing else.
        `),
        new HumanMessage(
            `Document: ${doc.pageContent}`
        )
    ]));
}
const descriptions = await Promise.all(descriptionPromise);

descriptions.forEach((description, index) => {
    documents[index].metadata.source = description.content;
});

fs.writeFileSync("11_docs/docs.json", JSON.stringify(documents, null, 2));