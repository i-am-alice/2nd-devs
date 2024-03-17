import { ChatOpenAI } from "langchain/chat_models/openai";
import {ChatPromptTemplate} from "langchain/prompts";

const systemTemplate = `
// Q: 2015 is coming in 36 hours. What is the date one week from today in MM/DD/YYYY?
// If 2015 is coming in 36 hours, then today is 36 hours before.
let today = new Date(2015, 0, 1);
today.setHours(today.getHours() - 36);
// One week from today,
let one_week_from_today = new Date(today);
one_week_from_today.setDate(today.getDate() + 7);
// The answer formatted with MM/DD/YYYY is
one_week_from_today.toLocaleDateString('en-US');

// Q: The first day of 2019 is a Tuesday, and today is the first Monday of 2019. What is the date today in MM/DD/YYYY?
// If the first day of 2019 is a Tuesday, and today is the first Monday of 2019, then today is 6 days later.
today = new Date(2019, 0, 1);
today.setDate(today.getDate() + 6);
// The answer formatted with MM/DD/YYYY is
today.toLocaleDateString('en-US');

// Q: The concert was scheduled to be on 06/01/1943, but was delayed by one day to today. What is the date 10 days ago in MM/DD/YYYY?
// If the concert was scheduled to be on 06/01/1943, but was delayed by one day to today, then today is one day later.
today = new Date(1943, 5, 1);
today.setDate(today.getDate() + 1);
// 10 days ago,
let ten_days_ago = new Date(today);
ten_days_ago.setDate(today.getDate() - 10);
// The answer formatted with MM/DD/YYYY is
ten_days_ago.toLocaleDateString('en-US');

// Q: It is 4/19/1969 today. What is the date 24 hours later in MM/DD/YYYY?
// It is 4/19/1969 today.
today = new Date(1969, 3, 19);
// 24 hours later,
let later = new Date(today);
later.setDate(today.getDate() + 1);
// The answer formatted with MM/DD/YYYY is
later.toLocaleDateString('en-US');

// Q: Jane thought today is 3/11/2002, but today is in fact Mar 12, which is 1 day later. What is the date 24 hours later in MM/DD/YYYY?
// If Jane thought today is 3/11/2002, but today is in fact Mar 12, then today is 3/12/2002.
today = new Date(2002, 2, 12);
// 24 hours later,
later = new Date(today);
later.setDate(today.getDate() + 1);
// The answer formatted with MM/DD/YYYY is
later.toLocaleDateString('en-US');

// Q: Jane was born on the last day of Feburary in 2001. Today is her 16-year-old birthday. What is the date yesterday in MM/DD/YYYY?
// If Jane was born on the last day of Feburary in 2001 and today is her 16-year-old birthday, then today is 16 years later.
today = new Date(2001, 1, 28);
today.setFullYear(today.getFullYear() + 16);
// Yesterday,
let yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
// The answer formatted with MM/DD/YYYY is
yesterday.toLocaleDateString('en-US');
`;
const humanTemplate = "Q: {question}";

const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", humanTemplate],
]);

const formattedChatPrompt = await chatPrompt.formatMessages({
    question: "Today is October 13, 2023. What will the date after 193 days from now in the format MM/DD/YYYY?",
});

const chat = new ChatOpenAI({
    modelName: "gpt-4"
});
const { content } = await chat.invoke(formattedChatPrompt);

console.log(content);
if (typeof content === "string") {
    console.log("Actual Date: " + eval(content));
}