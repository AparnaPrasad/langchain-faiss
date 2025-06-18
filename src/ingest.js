import 'dotenv/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { scrapeLangChainDocs } from './scraper.js';


async function ingestDocs(){
    try {
        // Initialize OpenAI embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // Scrape documentation
        console.log('Scraping LangChain documentation...');
        const docs = await scrapeLangChainDocs();

        // Split documents into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await textSplitter.createDocuments(
            docs.map(doc => doc.content),
            docs.map(doc => ({ source: doc.source }))
        );

        // Create and save the vector store
        console.log('Creating vector store...');
        const vectorStore = await FaissStore.fromDocuments(
            splitDocs,
            embeddings
        );

        // Save the vector store
        await vectorStore.save('./langchain-faiss-store');

        console.log('Vector store created and saved successfully!');
        return true;
    } catch (error) {
        console.error('Error during ingestion:', error instanceof Error ? error.message : String(error));
        return false;
    }
}

export { ingestDocs }; 