import {Document} from "langchain/document";

export const searchDocs = (docs: Document[], keywords: string[]) => {
    return docs.filter(doc => {
        for (let keyword of keywords) {
            // remove punctuation
            keyword = keyword.replace(/[.,\/#!$%\^&\*;:{}=\-?`~()]/g,"");
            if (doc.pageContent.toLowerCase().includes(keyword.toLowerCase()) && keyword.length > 3) {
                console.log('Found:' + keyword);
                return true;
            }
        }
        return false;
    });
}