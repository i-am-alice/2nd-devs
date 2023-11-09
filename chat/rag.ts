import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {COLLECTION_NAME, getDatabase, getEmbedding} from "./memory.ts";

export const search = async (query: string, type: 'memory' | 'tag') => {
    const [queryEmbedding] = await getEmbedding().embedDocuments([query]);
    const search = await getDatabase().search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit: 30,
        filter: {
            must: [
                {
                    key: 'type',
                    match: {
                        value: type
                    }
                }
            ]
        }
    });

    search.sort((a, b) => b.score - a.score);
    console.log('Reranking...');
    const reranked = await rerank(query, search);

    // filter top 5 docs if their metadata.tokens is less than 4000
    const results = [];
    const limit = 5500;
    let current = 0;
    for (const result of reranked) {
        if (current + result.payload.tokens < limit) {
            current += result.payload.tokens;
            results.push(result);
        }
    }

    return results;
}

export const rerank = async (query: string, documents: any) => {
    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo-16k',
        temperature: 0,
        maxConcurrency: 15,
    });

    const checks: any = [];
    for (const document of documents) {
        checks.push({
            id: document.payload.id,
            rank: model.call([
                new SystemMessage(`Check if the following document is relevant to this user query: """${query}""" and the lesson of the course (if its mentioned by the user) and may be helpful to answer the question / query.
                 Return 0 if not relevant, 1 if relevant. 
                 
                 Warning:
                 - You're forced to return 0 or 1 and forbidden to return anything else under any circumstances.
                 - Pay attention to the keywords from the query, mentioned links etc.
                 
                 Additional info: 
                 - Document title: ${document.payload.title}
                 - Document context (may be helpful): ${document.payload.header ?? 'n/a'}
                 
                 Document content: ##${document.payload.content}###
                 
                 Query:
                 `),
                new HumanMessage(query + '### Is relevant (0 or 1):'),
            ])
        });
    }

    const results = await Promise.all(checks.map((check: any) => check.rank));
    const rankings = results.map((result, index) => ({ id: checks[index].id, score: result.content }));
    return documents.filter((document: any) => rankings.find((ranking) => ranking.id === document.payload.id && ranking.score === '1'));
}