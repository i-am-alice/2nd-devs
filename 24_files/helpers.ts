import {IDoc, IDocMetadata, Link} from "./types.dt.ts";

export const extractLinksToMetadata = (docs: IDoc[]): IDoc[] => {
    const documents = docs;
    documents.forEach((doc) => {
        let i = 1;
        const urlToPlaceholder: Link = {};
        doc.pageContent = doc.pageContent.replace(/((http|https):\/\/[^\s]+|\.\/[^\s]+)(?=\))/g, (url) => {
            if (!urlToPlaceholder[url]) {
                const placeholder = `$${i++}`;
                urlToPlaceholder[url] = placeholder ?? '';

                doc.metadata.links[placeholder] = url;
            }
            return urlToPlaceholder[url];
        });
    });

    return documents;
}