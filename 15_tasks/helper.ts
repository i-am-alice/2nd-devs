import {BaseMessageChunk, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";

export const rephrase = async (response: string, query: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 1,
    });
    const { content } = await model.call([
        new SystemMessage(`
            Answer the question ultra-briefly using casual, human-friendly tone: 
            ###${query}###
            and act as if you just performed this action and confirming this fact to the user, using the following response: 
            ###${JSON.stringify(response)}###
        `),
    ])

    return content;
}

export const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: any } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }
    return {
        name: result.additional_kwargs.function_call.name,
        args: JSON.parse(result.additional_kwargs.function_call.arguments),
    }
}

export const currentDate = () => {
    let date = new Date();

    let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let weekday = weekdays[date.getDay()];

    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based in JS
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `${weekday}, ${month}/${day}/${year} ${hours}:${minutes}`;
}