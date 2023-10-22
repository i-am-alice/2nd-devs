import {TextLoader} from "langchain/document_loaders/fs/text";
import {NodeHtmlMarkdown} from "node-html-markdown";
import * as cheerio from "cheerio";
import {Document} from "langchain/document";
import * as fs from "fs";
import {IDocMetadata, Link} from "./types.dt.ts";
import {extractLinksToMetadata} from "./helpers.ts";

const loader = new TextLoader("24_files/aidevs.html");
const [html] = await loader.load();
// Load HTML
const $ = cheerio.load(html.pageContent);
// Get authors section
const authors = $("#instructors").html() ?? '';
// Convert HTML to markdown
const markdown = NodeHtmlMarkdown.translate(authors);
// Split markdown into chunks
const chunks = markdown.split(/(?!^)(?=\!\[\]\(.*\)\n\n\[.*\]\(.*\)\n\n###)/g);

let docs: Document<IDocMetadata>[] = chunks.map(chunk => {
    // Get author name
    const author = chunk.match(/### (.*(?:\n.*)?) /)?.[1];
    // Create metadata
    const metadata: IDocMetadata = {
        source: 'aidevs',
        section: 'instructors',
        author: author?.replace(' \n', '').trim() ?? '',
        links: {},
    };

    return new Document({
        pageContent: chunk.replace(/[\n\\]/g, '').replace(/\s{2,}/g, ' '),
        metadata
    })
});
docs = docs.filter(doc => doc.pageContent.length > 50);
docs = extractLinksToMetadata(docs);

fs.writeFileSync('24_files/aidevs.json', JSON.stringify(docs, null, 2))