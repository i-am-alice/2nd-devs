import { Document } from "langchain/document";

export type Link = { [key: string]: string };

export interface IDocMetadata {
    source: string,
    section: string,
    author: string,
    links: Link,
}

export interface IDoc extends Document {
    metadata: IDocMetadata,
}