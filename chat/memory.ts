import {IEnrichMetadata, ISplitMetadata} from "./chat.dt.ts";
import {Document} from "langchain/document";
import {v4} from "uuid";
import {countTokens} from "./helpers.ts";
import {DirectoryLoader} from "langchain/document_loaders/fs/directory";
import {TextLoader} from "langchain/document_loaders/fs/text";
import fs from "fs";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {parseFunctionCall} from "../14_agent/helper.ts";
import {QdrantClient} from "@qdrant/js-client-rest";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";

const MEMORY_FILE = 'chat/memories.json';
export const COLLECTION_NAME = "ai_devs";
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

export const getDatabase = () => qdrant;
export const getEmbedding = () => embeddings;

export const loadMemory = async () => {
    const result = await qdrant.getCollections();
    const indexed = result.collections.find((collection) => collection.name === COLLECTION_NAME);

    // Jeśli indeks nie istnieje, utwórz go dla text-embedding-ada-002 (1536 wymiarów)
    if (!indexed) {
        console.log('Creating collection...');
        await qdrant.createCollection(COLLECTION_NAME, { vectors: { size: 1536, distance: 'Cosine', on_disk: true }});
    }

    const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

    // Sprawdź czy dokumenty są już zaindeksowane
    if (!collectionInfo.points_count) {
        // Load documents from the filesystem
        let memories = await loadMemories();
        // Generate embeddings
        const points = [];

        for (const memory of memories) {
            const [embedding] = await embeddings.embedDocuments([memory.pageContent]);
            points.push({
                id: memory.metadata.id,
                payload: {
                    ...memory.metadata,
                    type: 'memory'
                },
                vector: embedding,
            });
        }

        const tags = memories.map((memory) => {
            memory.pageContent = memory.metadata.tags.join(',');
            memory.metadata.content = memory.metadata.tags.join(',');
            memory.metadata.type = 'tag'
            return memory;
        });

        for (const tag of tags) {
            const [embedding] = await embeddings.embedDocuments([tag.pageContent]);
            points.push({
                id: v4(),
                docId: tag.metadata.id,
                payload: {
                    ...tag.metadata
                },
                vector: embedding,
            });
        }

        // Index
        await qdrant.upsert(COLLECTION_NAME, {
            wait: true,
            batch: {
                ids: points.map((point) => (point.id)),
                vectors: points.map((point) => (point.vector)),
                payloads: points.map((point) => (point.payload)),
            },
        });
    }
}

export const loadMemories = async () => {
    // Wczytaj pliki .txt z katalogu chat/memories
    const loader = new DirectoryLoader(
        "chat/memories",
        {
            ".txt": (path) => new TextLoader(path),
        }
    );
    let memories: Document[] = [];
    const docs = await loader.load();

    // Podziel dokumenty na fragmenty o wielkości 2500 tokenów
    for (const doc of docs) {
        split(doc.pageContent, {
            title: doc.metadata.source.split('/').pop().replace(/\.[^/.]+$/, "").replace(/\.[^/.]+$/, "").replace('EN:', '') ?? 'n/a',
            size: 2500,
            estimate: true,
            url: 'https://bravecourses.circle.so/c/lekcje-programu/'
        }).forEach((doc) => memories.push(doc));
    }

    // Wygeneruj tagi dla każdego dokumentu
    memories = await Promise.all(memories.map(async (memory) => {
        memory.metadata.tags = await generateTags(memory, {
            title: memory.metadata.title.replace('EN:', ''),
            header: memory.metadata.header,
        });
        return memory;
    }));

    // Zapisz fragmenty do pliku JSON
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memories, null, 2));
    return memories;
};

export const generateTags = async (document: Document, config: IEnrichMetadata) => {
    const generateTagsSchema = {
        "name": "generate_tags",
        "description": "Generate semantic tags for a given document to be used for search and retrieval, always written in English",
        "parameters": {
            "type": "object",
            "properties": {
                "tags": {
                    "type": "array",
                    "description": "List of tags",
                    "items": {
                        "type": "string",
                        "properties": {
                            "tag": {
                                "type": "string",
                                "description": "SEO friendly, semantic tag without non-ASCII or special characters"
                            }
                        }
                    }
                },
            },
            "required": ["tags"]
        }
    }
    const model = new ChatOpenAI({
        modelName: 'gpt-4-0613',
        temperature: 0,
        maxConcurrency: 5,
    }).bind({functions: [generateTagsSchema], function_call: { name: 'generate_tags' } });

    const response = await model.invoke([
        new SystemMessage(`Generate tags for the following document.
        Additional info: 
        - Document title: ${config.title}
        - Document context (may be helpful): ${config.header ?? 'n/a'}
        
        `),
        new HumanMessage(document.pageContent),
    ])
    const result = parseFunctionCall(response);
    const tags = result?.args?.tags?.map((tag: string) => tag.toLowerCase().replaceAll(/[\s-]/g, '_')) ?? [];
    return tags;
}

export const split = (text: string, config: ISplitMetadata) => {
    const documents: Document[] = [];
    let document = '';

    // split by header or double new line
    const chunks = /#/.test(text) ? text.split(/\n(?=\#+)/g) : text.split("\n\n");
    let topic = '';

    for (const chunk of chunks) {
        if (!chunk.trim()) continue;

        const header = chunk.match(/^\#.*$/m)?.[0] ?? 'n/a';
        topic = chunk.match(/^## [^#].*$/m)?.[0] ?? topic;
        const uuid = v4();

        const chunkTokens = config.estimate
            ? countTokens([{ role: 'human', content: document + chunk }], 'gpt-4-0613')
            : (document + chunk).length;

        if (chunkTokens > config.size) {
            let subChunk = '';
            const sentences = chunk.split(/(?<=[.?!])\s+(?=[A-Z])/g);
            let tokenCount = 0;
            let sentenceIndex = 0;
            while (tokenCount <= config.size && sentenceIndex < sentences.length) {
                const sentence = sentences[sentenceIndex];
                const sentenceTokens = config.estimate
                    ? countTokens([{ role: 'human', content: sentence }], 'gpt-4-0613')
                    : sentence.length;
                if (tokenCount + sentenceTokens > config.size) {
                    documents.push(
                        new Document({
                            pageContent: subChunk,
                            metadata: {
                                id: uuid,
                                header,
                                title: config.title,
                                context: config.context ?? topic,
                                source: `${config.url ?? ''}${config.title.toLowerCase().replaceAll(' — ', '-').replaceAll(' ', '-')}`,
                                tokens: tokenCount,
                                content: subChunk
                            }
                        })
                    )
                    subChunk = '';
                }
                tokenCount += sentenceTokens;
                subChunk += sentence;
                sentenceIndex++;
            }
        } else {
            if (chunkTokens <= 50) {
                continue;
            }
            documents.push(
                new Document({
                    pageContent: chunk.trim(),
                    metadata: {
                        id: uuid,
                        header,
                        title: config.title,
                        context: config.context ?? topic,
                        source: `${config.url ?? ''}${config.title.toLowerCase().replaceAll(' — ', '-').replaceAll(' ', '-')}`,
                        tokens: chunkTokens,
                        content: chunk.trim()
                    }
                })
            )
        }
    }

    return documents;
}