import { ingestDocs } from './ingest.js';

async function main(){
    try {
        await ingestDocs();
    } catch (error) {
        console.error('Error during ingestion:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main(); 