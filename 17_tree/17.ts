import {AIMessage, HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import * as fs from "fs";
const chat = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
});
const query = `I have been working on a desktop app project for macOS for a few months now. At this stage, I have approximately 2000 users of this app and I'm the only developer (can't change atm). This success signals that I may need to invest more resources into this project. Currently, I am the only developer of this app. Moreover, this is not my only project; I have several others, which necessitates careful time management and focus. I am faced with the decision of choosing between two paths:

The first is about implementing a redesign, which has already been completed. The goal is to improve the overall brand and, specifically, the app's user experience. I plan to fix UI bugs, enhance performance, and add the most-requested features. This may attract more users to the app.

The second option is about extending the backend. This will provide me with much more flexibility when implementing even the most advanced features requested by users, although I cannot guarantee they will actually use them. This path would require a larger time investment initially but would improve the development process in the future.

Note: 
- I'm a full-stack designer and full-stack developer. I have broad experience in product development and all business areas.
- I'm a solo founder and I'm not looking for a co-founder or team
- I'm familiar with all the concepts and tools so feel free to use them

Help me decide which path to take by focusing solely on a business context.`;

let conversation = [
    new SystemMessage(`Act an expert in mental models, critical thinking, and making complex, strategic decisions. Use markdown syntax to format your responses throughout the conversation.`),
    new HumanMessage(
        `${query}. Can you brainstorm three different possible strategies that I could take to effectively create new content and do this consistently while maintaining my energy, life balance, and overall quality of the content I produce?  Please be concise, yet detailed as possible.`
    ),
];
async function chatAndLog(message: string) {
    conversation.push(new HumanMessage(message));
    const { content } = await chat.invoke(conversation);
    conversation.push(new AIMessage(content));
    return content;
}

await chatAndLog(`For each solution, evaluate their potential, pros and cons, effort needed, difficulty, challenges and expected outcomes. Assign success rate and confidence level for each option.`);
await chatAndLog(`Extend each solution by deepening the thought process. Generate different scenarios, strategies of implementation that include external resources and how to overcome potential unexpected obstacles.`);
await chatAndLog(`For each scenario, generate a list of tasks that need to be done to implement the solution.`);
await chatAndLog(`Based on the evaluations and scenarios, rank the solutions in order. Justify each ranking and offer a final solution.`);

const conversationText = `${conversation.map((message) => `## ${message._getType()}:\n\n${message.content}`).join('\n\n')}}`;
fs.writeFileSync('17_tree/result.md', conversationText);