import { ChatOpenAI } from "langchain/chat_models/openai";
import {BaseMessageChunk, HumanMessage} from "langchain/schema";
const queryEnrichmentSchema = {
    "name": "query_enrichment",
    "description": "Describe users query with semantic tags and classify with type",
    "parameters": {
        "type": "object",
        "properties": {
            "command": {
                "type": "boolean",
                "description": "Set to 'true' when query is direct command for AI. Set to 'false' when queries asks for saying/writing/translating/explaining something and all other."
            },
            "type": {
                "type": "string",
                "description": "memory (queries about the user and/or AI), notes|links (queries about user's notes|links). By default pick 'memory'.",
                "enum": ["memory", "notes", "links"]
            },
            "tags": {
                "type": "array",
                "description": "Multiple semantic tags/keywords that enriches query for search purposes (similar words, meanings). When query refers to the user, add 'overment' tag, and when refers to 'you' add tag 'Alice'",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "type", "tags", "command"
        ]
    }
};
const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
}).bind({
    functions: [queryEnrichmentSchema],
    function_call: { name: "query_enrichment" },
});
console.log({
    functions: [queryEnrichmentSchema],
    function_call: { name: "query_enrichment" },
})
const result = await model.invoke([
    new HumanMessage("Hey there!")
]);
const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: any } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }
    return {
        name: result.additional_kwargs.function_call.name,
        args: JSON.parse(result.additional_kwargs.function_call.arguments),
    }
}
const action = parseFunctionCall(result);
if (action) {
    console.log(action.name, action.args);
}


