import axios from 'axios';
import { load } from 'cheerio';

function normalizeUrl(url) {
    // Remove trailing slash and normalize the URL
    return url.replace(/\/+$/, '');
}

async function scrapeLangChainDocs() {
    const baseUrl = 'https://js.langchain.com';
    const startUrl = normalizeUrl(`${baseUrl}/docs/`);
    const visited = new Set();
    const docs = [];

    async function scrapePage(url){
        const normalizedUrl = normalizeUrl(url);
        if (visited.has(normalizedUrl)) {
            //console.log(`Skipping already visited: ${normalizedUrl}`);
            return;
        }
        visited.add(normalizedUrl);
        
        try {
            //console.log(`\nScraping: ${normalizedUrl}`);
            const response = await axios.get(normalizedUrl);
            const $ = load(response.data);
            
            // Extract text content from the current page
            $('article').each((i, element) => {
                const text = $(element).text().trim();
                if (text) {
                    docs.push({
                        content: text,
                        source: normalizedUrl
                    });
                }
            });
            //console.log(`Found ${docs.length} content blocks on ${normalizedUrl}`);

            // Find and follow documentation links
            const links = $('a[href^="/docs/"]')
                .map((i, el) => {
                    const href = $(el).attr('href');
                    return href && !href.includes('#') ? normalizeUrl(`${baseUrl}${href}`) : null;
                })
                .get()
                .filter(Boolean);

            //console.log(`Found ${links.length} documentation links on ${normalizedUrl}`);

            // Recursively scrape linked pages
            for (const link of links) {
                await scrapePage(link);
            }
        } catch (error) {
            console.error(`Error scraping ${normalizedUrl}:`, error instanceof Error ? error.message : String(error));
        }
    }

    console.log('Starting documentation scrape...');
    await scrapePage(startUrl);
    console.log(`\nScraping complete!`);
    console.log(`Total unique pages scraped: ${visited.size}`);
    console.log(`Total content blocks: ${docs.length}`);
    
    return docs;
}

export { scrapeLangChainDocs }; 