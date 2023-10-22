import * as fs from "fs";
import {NodeHtmlMarkdown} from "node-html-markdown";
import {Browser, Page, PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";

const loader = new PuppeteerWebBaseLoader("https://brain.overment.com", {
    launchOptions: {
        headless: "new",
    },
    gotoOptions: {
        waitUntil: "domcontentloaded",
    },
    async evaluate(page: Page, browser: Browser) {
        // @ts-ignore
        const result = await page.evaluate(() => document.querySelector('.main').innerHTML);
        return NodeHtmlMarkdown.translate(result);
    },
});

const docs = await loader.load();

docs.forEach((doc) => {
    let i = 1;
    const urlToPlaceholder: { [key: string]: string } = {};

    doc.pageContent = doc.pageContent.replace(/((http|https):\/\/[^\s]+|\.\/[^\s]+)(?=\))/g, (url) => {
        if (!urlToPlaceholder[url]) {
            const placeholder = `$${i++}`;
            urlToPlaceholder[url] = placeholder;
            doc.metadata[placeholder] = url;
        }
        return urlToPlaceholder[url];
    });
});

fs.writeFileSync("12_web/docs.json", JSON.stringify(docs, null, 2));