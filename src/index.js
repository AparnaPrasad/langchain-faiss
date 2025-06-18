import 'dotenv/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ingestDocs } from './ingest.js';
import { ChatOpenAI } from '@langchain/openai';


async function queryDocs(query) {
    try {
        // Initialize OpenAI embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // Load the vector store
        const vectorStore = await FaissStore.load(
            './langchain-faiss-store',
            embeddings
        );

        // Perform the search
        const results = await vectorStore.similaritySearch(query, 3);
        
        // Combine the retrieved contexts
        const context = results.map(doc => doc.pageContent).join('\n\n');

        // Initialize the LLM
        const llm = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'gpt-3.5-turbo',
            temperature: 0.7,
        });

        // Create the prompt for the LLM
        const prompt = `Based on the following context from the LangChain documentation, please answer the question. 
        If the answer cannot be found in the context, say so.

        Context:
        ${context}

        Question: ${query}

        Answer:`;

        // Generate the answer
        const response = await llm.invoke(prompt);
        const answer = typeof response.content === 'string' 
            ? response.content 
            : JSON.stringify(response.content);

        console.log('\nRetrieved Context:');
        results.forEach((doc, i) => {
            console.log(`\nContext ${i + 1}:`);
            console.log(doc.pageContent);
            console.log('Source:', doc.metadata.source);
        });

        console.log('\nGenerated Answer:');
        console.log(answer);

        return {
            answer,
            sources: results.map(doc => doc.metadata.source)
        };
    } catch (error) {
        console.error('Error querying documents:', error instanceof Error ? error.message : String(error));
        return null;
    }
}

async function main(){
    // Check if vector store exists, if not, run ingestion
    try {
        await FaissStore.load('./langchain-faiss-store', new OpenAIEmbeddings());
    } catch (error) {
        console.log('Vector store not found. Running ingestion...');
        await ingestDocs();
    }

    // Example query
    const query = "What is LCEL?";
    console.log(`\nQuerying: ${query}`);
    await queryDocs(query);
}

main(); 