export const summarizationSchema = {
    "name": "summarization",
    "description": "Extend an content and tags of the document from your memory, based on the new chunk of text that comes from the user's latest message.",
    "parameters": {
        "type": "object",
        "properties": {
            "content": {
                "type": "string",
                "description": "Comprehensive and detail oriented article build using both current memory and a summary of the user message, always written in Markdown, have to include links and images that comes from the user's message, to improve readability and help user understand the whole document. IMPORTANT: Extend the existing article instead of generating a new one from scratch. Always pay attention to the details and keep facts, links and sources."
            },
            "tags": {
                "type": "array",
                "description": "The most relevant to the topic, semantic lower-cased hashtags handles tags/keywords that enriches query for search purposes (similar words, meanings).",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": ["content", "tags"]
    }
};