---
sidebar_position: 6
title: RAG Applications
description: Build retrieval-augmented generation applications with vector databases.
---

# RAG Applications

Retrieval-Augmented Generation (RAG) combines LLMs with your own data to produce accurate, grounded responses. Instead of relying solely on the model's training data, RAG retrieves relevant documents from a knowledge base and includes them as context in the LLM prompt.

## RAG Architecture Overview

A RAG pipeline has two phases:

1. **Ingestion** -- Documents are chunked, converted to embeddings, and stored in a vector database.
2. **Retrieval and Generation** -- A user query is converted to an embedding, similar documents are retrieved, and the LLM generates a response grounded in those documents.

```
Documents --> Chunking --> Embedding Model --> Vector DB (store)
User Query --> Embedding Model --> Vector DB (search) --> LLM --> Response
```

## Connecting to Vector Databases

Use Ballerina connectors to interact with vector databases for storing and querying embeddings.

```ballerina
import ballerinax/pinecone;

configurable string pineconeApiKey = ?;
configurable string pineconeEnvironment = ?;
configurable string indexName = "knowledge-base";

final pinecone:Client pineconeClient = check new ({
    apiKey: pineconeApiKey,
    environment: pineconeEnvironment
});
```

### Supported Vector Databases

| Database | Package | Best For |
|---|---|---|
| Pinecone | `ballerinax/pinecone` | Managed, scalable vector search |
| ChromaDB | HTTP client | Local development and prototyping |
| Weaviate | HTTP client | Hybrid search (vector + keyword) |
| PostgreSQL + pgvector | `ballerinax/postgresql` | Existing PostgreSQL infrastructure |

## Generating Embeddings

Convert text into vector embeddings using an embedding model.

```ballerina
import ballerina/http;

configurable string openAiKey = ?;

final http:Client openAiClient = check new ("https://api.openai.com", {
    auth: {token: openAiKey}
});

type EmbeddingResponse record {
    EmbeddingData[] data;
};

type EmbeddingData record {
    float[] embedding;
};

function generateEmbedding(string text) returns float[]|error {
    json payload = {
        model: "text-embedding-3-small",
        input: text
    };
    EmbeddingResponse response = check openAiClient->post("/v1/embeddings", payload);
    return response.data[0].embedding;
}

function generateBatchEmbeddings(string[] texts) returns float[][]|error {
    json payload = {
        model: "text-embedding-3-small",
        input: texts
    };
    EmbeddingResponse response = check openAiClient->post("/v1/embeddings", payload);
    return from EmbeddingData d in response.data select d.embedding;
}
```

## Document Ingestion Pipeline

Build a pipeline that reads documents, chunks them, generates embeddings, and stores them in a vector database.

```ballerina
type DocumentChunk record {|
    string id;
    string text;
    string source;
    int chunkIndex;
|};

function ingestDocument(string filePath) returns error? {
    string content = check io:fileReadString(filePath);

    // Split into chunks
    DocumentChunk[] chunks = chunkText(content, filePath, chunkSize = 512, overlap = 50);

    // Generate embeddings for each chunk
    string[] texts = from DocumentChunk c in chunks select c.text;
    float[][] embeddings = check generateBatchEmbeddings(texts);

    // Store in vector database
    foreach int i in 0 ..< chunks.length() {
        check storeVector(chunks[i].id, embeddings[i], {
            text: chunks[i].text,
            source: chunks[i].source,
            chunkIndex: chunks[i].chunkIndex
        });
    }

    log:printInfo("Document ingested", filePath = filePath, chunks = chunks.length());
}
```

### Chunking Strategies

Split documents into appropriately sized chunks for effective retrieval.

```ballerina
function chunkText(string text, string source, int chunkSize, int overlap) returns DocumentChunk[] {
    DocumentChunk[] chunks = [];
    string[] words = re `\s+`.split(text);
    int index = 0;
    int chunkNum = 0;

    while index < words.length() {
        int end = int:min(index + chunkSize, words.length());
        string chunkText = " ".'join(...words.slice(index, end));
        chunks.push({
            id: source + "-" + chunkNum.toString(),
            text: chunkText,
            source: source,
            chunkIndex: chunkNum
        });
        index += chunkSize - overlap;
        chunkNum += 1;
    }
    return chunks;
}
```

## Building a RAG-Powered Service

Combine retrieval and generation into an HTTP service.

```ballerina
import ballerina/http;

type RagRequest record {|
    string question;
    int topK = 5;
|};

type RagResponse record {|
    string answer;
    string[] sources;
|};

service /rag on new http:Listener(8090) {

    resource function post query(@http:Payload RagRequest req) returns RagResponse|error {
        // Step 1: Generate embedding for the question
        float[] queryEmbedding = check generateEmbedding(req.question);

        // Step 2: Retrieve similar documents
        SearchResult[] results = check searchVectors(queryEmbedding, req.topK);

        // Step 3: Build context from retrieved documents
        string context = buildContext(results);

        // Step 4: Generate answer using LLM with retrieved context
        string answer = check generateAnswer(req.question, context);
        string[] sources = from SearchResult r in results select r.metadata.source;

        return {answer, sources};
    }
}

function buildContext(SearchResult[] results) returns string {
    return " ".'join(...from SearchResult r in results select r.metadata.text);
}

function generateAnswer(string question, string context) returns string|error {
    json payload = {
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "Answer the question based only on the provided context. "
                    + "If the context does not contain enough information, say so."
            },
            {
                role: "user",
                content: string `Context: ${context}\n\nQuestion: ${question}`
            }
        ]
    };
    json response = check openAiClient->post("/v1/chat/completions", payload);
    return check response.choices[0].message.content;
}
```

## Chunking and Embedding Best Practices

1. **Chunk size** -- 256-512 tokens is a good starting point. Smaller chunks improve precision; larger chunks provide more context.
2. **Overlap** -- Use 10-20% overlap between chunks to avoid losing context at boundaries.
3. **Metadata** -- Store source file, page number, section heading, and chunk index alongside each vector for accurate source attribution.
4. **Embedding model** -- Use models like `text-embedding-3-small` for cost efficiency or `text-embedding-3-large` for higher accuracy.
5. **Re-ranking** -- After initial vector retrieval, consider a cross-encoder re-ranking step to improve relevance.

## What's Next

- [AI Agents](ai-agents.md) -- Add RAG as a tool in your agents
- [Services](services.md) -- Expose RAG as an API
