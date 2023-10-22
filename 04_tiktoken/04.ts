import type { Message } from "./types";
import { countTokens } from './count_tokens';
import { get_encoding } from "tiktoken";

const messages: Message[] = [
    {
        "role": "system",
        "content": "Hey, you!",
    }
];

const num = countTokens(messages, 'gpt-4'); // 11
console.log(`Token Count: `, num);
const encoding = get_encoding("cl100k_base");
console.log(`Token IDs: `, encoding.encode(messages[0].content));