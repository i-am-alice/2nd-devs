import * as fs from "fs";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {IFile, parseFunctionCall, split} from "./helpers.ts";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {summarizationSchema} from "./schema.ts";
import {getSystemPrompt} from "./prompts.ts";

const file: IFile = {title: "Lekcja kursu AI_Devs, S03L03 — Wyszukiwanie i bazy wektorowe", name: 'draft.md', author: 'Adam', excerpt: '', content: '', tags: [],}
let summary: Pick<IFile, "content"> = {content: ''};

const loader = new TextLoader(`26_summarize/${file.name}`);
const [doc] = await loader.load();
const documents = split(doc.pageContent, 2000);

const model = new ChatOpenAI({ modelName: "gpt-4", maxConcurrency: 5 })
    .bind({functions: [summarizationSchema], function_call: { name: "summarization" },});

export const summarize = async (chunk: string, file: IFile) => {
    const system = getSystemPrompt(file);

    return model.invoke([
        new SystemMessage(system),
        new HumanMessage(`###${chunk}###`)
    ]);
}

const intro = `# Summary of the document ${file.title}\n\n`;
fs.writeFileSync("26_summarize/summarized.md", intro);

for (let i = 0; i < documents.length; i++) {
    const result = await summarize(documents[i].pageContent, {...file, ...summary});
    const action = parseFunctionCall(result);
    if (action) {
        console.log("SAVING")
        console.log(action.args.content)
        fs.appendFileSync("26_summarize/summarized.md", action.args.content + "\n\n");
    }
}