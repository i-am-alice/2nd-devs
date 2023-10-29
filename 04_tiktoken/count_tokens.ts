import {Message} from "./types";
import { get_encoding } from "tiktoken";

// Rolą tej funkcji jest estymowanie liczby tokenów w przekazanych wiadomościach z uwzględnieniem encodera konkretnego modelu
export const countTokens = (messages: Message[], model="gpt-3.5-turbo-0613"): number => {
    const encoding = get_encoding("cl100k_base");

    let tokens_per_message, tokens_per_name;
    if (["gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k-0613", "gpt-4-0314", "gpt-4-32k-0314", "gpt-4-0613", "gpt-4-32k-0613"].includes(model)) {
        tokens_per_message = 3;
        tokens_per_name = 1;
    } else if (model === "gpt-3.5-turbo-0301") {
        tokens_per_message = 4;
        tokens_per_name = -1;
    } else if (model.includes("gpt-3.5-turbo")) {
        console.warn("Warning: gpt-3.5-turbo may update over time. Returning num tokens assuming gpt-3.5-turbo-0613.");
        return countTokens(messages, "gpt-3.5-turbo-0613");
    } else if (model.includes("gpt-4")) {
        console.warn("Warning: gpt-4 may update over time. Returning num tokens assuming gpt-4-0613.");
        return countTokens(messages, "gpt-4-0613");
    } else {
        throw new Error(`num_tokens_from_messages() is not implemented for model ${model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`);
    }
    let num_tokens = 0;
    for (let message of messages) {
        num_tokens += tokens_per_message;
        for (let [key, value] of Object.entries(message)) {
            num_tokens += encoding.encode(value).length;
            if (key === "name") {
                num_tokens += tokens_per_name;
            }
        }
    }
    num_tokens += 3;
    return num_tokens;
}