# LangChain FAISS Document Q&A System

A simple document Q&A system using LangChain and FAISS for efficient similarity search and retrieval.

## Project Structure

```
langchain-faiss/
├── src/
│   ├── ingest.js        # Document ingestion and vector store creation
│   ├── scraper.js       # Web scraper for LangChain documentation
│   └── types.js         # TypeScript type definitions
├── package.json         # Project dependencies and scripts
└── .env                # Environment variables (not tracked in git)
```

## Features

- Web scraping of LangChain documentation
- Document chunking and embedding using OpenAI
- FAISS vector store for efficient similarity search
- Document Q&A capabilities

## Prerequisites

- Node.js >= 18
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd langchain-faiss
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

## Usage

1. Start the application:
```bash
npm start 
```
To just run injest
```bash
npm run injest 
```

## Dependencies

- @langchain/community: ^0.0.34
- @langchain/openai: ^0.0.14
- @langchain/textsplitters: Latest version
- dotenv: ^16.4.5
- faiss-node: ^0.5.1

## Development

The project uses ES modules and requires Node.js version 18 or higher. The main components are:

- `ingest.js`: Handles document ingestion, chunking, and vector store creation
- `scraper.js`: Scrapes LangChain documentation for content
- `types.js`: Contains TypeScript type definitions

## License

ISC 