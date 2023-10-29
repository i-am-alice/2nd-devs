import {BaseMessageChunk} from "langchain/schema";

export const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: any } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }
    return {
        name: result.additional_kwargs.function_call.name,
        args: JSON.parse(result.additional_kwargs.function_call.arguments),
    }
}