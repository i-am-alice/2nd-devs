export interface Message {
    role: string;
    content: string;
    name?: string;
}
export interface IMatch {
    id: string;
    version: number;
    score: number;
    payload: IPayload;
    vector: null;
}

interface IPayload {
    content: string;
    context: string;
    header: string;
    id: string;
    source: string;
    tags: string[];
    title: string;
    tokens: number;
    type: string;
}

export interface ISplitMetadata {
    title: string;
    header?: string;
    context?: string;
    source?: string;
    size: number;
    estimate: boolean;
    url?: string;
}
export interface IEnrichMetadata {
    title: string;
    header?: string;
    context?: string;
    source?: string;
    url?: string;
}