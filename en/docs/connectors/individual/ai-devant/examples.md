---
title: "Devant Document Processing - Examples"
description: "Code examples for the ballerinax/ai.devant connector."
---

# Devant Document Processing Examples

## Example 1: Load and Chunk a PDF Document

Load a PDF file from the filesystem and split it into chunks using the Devant AI service.

```ballerina
import ballerina/ai;
import ballerina/io;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    // Load a PDF document
    devant:BinaryDataLoader loader = check new ("./documents/product-manual.pdf");
    ai:Document|ai:Document[] docs = check loader.load();

    // Chunk using Devant AI service
    devant:Chunker chunker = new (serviceUrl, accessToken);
    if docs is ai:Document {
        ai:Chunk[] chunks = check chunker.chunk(docs);
        io:println("Total chunks: ", chunks.length());
        foreach int i in 0 ..< chunks.length() {
            io:println(string `Chunk ${i + 1}: ${chunks[i].content.substring(0, 100)}...`);
        }
    }
}
```

```toml
# Config.toml
serviceUrl = "https://your-devant-service.wso2.com"
accessToken = "<your-devant-access-token>"
```

## Example 2: RAG Pipeline with Devant and a Vector Store

Use Devant for document ingestion in a complete RAG pipeline with Pinecone as the vector store.

```ballerina
import ballerina/ai;
import ballerina/io;
import ballerinax/ai.devant;
import ballerinax/ai.openai;
import ballerinax/ai.pinecone;

configurable string devantServiceUrl = ?;
configurable string devantAccessToken = ?;
configurable string openAiApiKey = ?;
configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;

public function main() returns error? {
    // Step 1: Load and chunk the document
    devant:BinaryDataLoader loader = check new ("./knowledge/faq.pdf");
    ai:Document|ai:Document[] docs = check loader.load();

    devant:Chunker chunker = new (devantServiceUrl, devantAccessToken);
    ai:Chunk[] chunks = [];
    if docs is ai:Document {
        chunks = check chunker.chunk(docs);
    }
    io:println("Chunked document into ", chunks.length(), " segments");

    // Step 2: Initialize the embedding model and vector store
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );
    ai:VectorStore vectorStore = check new pinecone:VectorStore(
        serviceUrl = pineconeServiceUrl,
        apiKey = pineconeApiKey
    );

    // Step 3: Embed and store chunks
    foreach int i in 0 ..< chunks.length() {
        // In practice, use a proper embedding model to generate vectors
        ai:VectorEntry entry = {
            id: string `chunk-${i}`,
            embedding: [],  // Replace with actual embeddings
            chunk: chunks[i]
        };
    }

    io:println("RAG pipeline ingestion complete");
}
```

## Example 3: Process Multiple Documents

Load and chunk multiple documents from a directory for batch processing.

```ballerina
import ballerina/ai;
import ballerina/file;
import ballerina/io;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    devant:Chunker chunker = new (serviceUrl, accessToken);

    string[] files = ["report-q1.pdf", "report-q2.pdf", "report-q3.pdf"];
    ai:Chunk[] allChunks = [];

    foreach string fileName in files {
        string filePath = string `./reports/${fileName}`;

        // Check if file exists
        if !check file:test(filePath, file:EXISTS) {
            io:println("Skipping missing file: ", filePath);
            continue;
        }

        // Load and chunk each document
        devant:BinaryDataLoader loader = check new (filePath);
        ai:Document|ai:Document[] docs = check loader.load();

        if docs is ai:Document {
            ai:Chunk[] chunks = check chunker.chunk(docs);
            io:println(string `${fileName}: ${chunks.length()} chunks`);
            allChunks.push(...chunks);
        }
    }

    io:println("Total chunks across all documents: ", allChunks.length());
}
```

## Example 4: Error Handling with Document Processing

Robust error handling when loading and chunking documents.

```ballerina
import ballerina/ai;
import ballerina/io;
import ballerina/log;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    // Handle loading errors
    devant:BinaryDataLoader|error loader = new ("./missing-file.pdf");
    if loader is error {
        log:printError("Failed to create loader", 'error = loader);
        return;
    }

    do {
        ai:Document|ai:Document[] docs = check loader.load();

        devant:Chunker chunker = new (serviceUrl, accessToken);
        if docs is ai:Document {
            ai:Chunk[] chunks = check chunker.chunk(docs);
            io:println("Successfully processed document into ", chunks.length(), " chunks");

            // Validate chunks are non-empty
            foreach ai:Chunk chunk in chunks {
                if chunk.content.length() == 0 {
                    log:printWarn("Empty chunk detected, skipping");
                    continue;
                }
                io:println("Valid chunk: ", chunk.content.substring(0, 50));
            }
        }
    } on fail error e {
        log:printError("Document processing failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
