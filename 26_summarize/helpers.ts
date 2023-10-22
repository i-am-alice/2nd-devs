
import {BaseMessageChunk} from "langchain/schema";
import {countTokens} from "../04_tiktoken/count_tokens.ts";
import {Document} from "langchain/document";
export interface IFile {
    author: string;
    name: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
}

export const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: Pick<IFile, "content"> } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }

    let args;
    try {
        args = JSON.parse(result.additional_kwargs.function_call.arguments)
    } catch (e) {
        console.log(result.additional_kwargs.function_call.arguments);
        return null;
    }

    return {
        name: result.additional_kwargs.function_call.name,
        args
    }
}

export const split = (text: string, size = 500) => {
    const documents = [];
    let document = '';
    for (let chunk of text.split("\n\n")) {
        const tokens = countTokens([{ 'role': 'human', 'content': document + chunk }], 'gpt-4-0613');
        console.log(tokens);
        if (tokens > size) {
            documents.push(new Document({ pageContent: document }));
            document = chunk;
        } else {
            document += " " + chunk;
        }
    }
    if (document) {
        documents.push(new Document({ pageContent: document }));
    }

    return documents;
}