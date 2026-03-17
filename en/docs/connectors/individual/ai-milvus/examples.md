---
title: "Milvus Vector Store (AI Module) - Examples"
description: "Code examples for the ballerinax/ai.milvus connector."
---

# Milvus Vector Store (AI Module) Examples

## Example 1: Store and Query Vectors

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.milvus;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new milvus:VectorStore(
        serviceUrl = milvusServiceUrl,
        apiKey = milvusApiKey,
        config = {
            collectionName: "articles"
        }
    );

    // Store vectors with content chunks
    ai:Error? addResult = vectorStore.add(
        [
            {
                id: "article-1",
                embedding: [0.1, 0.2, 0.3],
                chunk: {'type: "text", content: "Introduction to microservices architecture."}
            },
            {
                id: "article-2",
                embedding: [0.4, 0.5, 0.6],
                chunk: {'type: "text", content: "Event-driven integration patterns."}
            },
            {
                id: "article-3",
                embedding: [0.7, 0.8, 0.9],
                chunk: {'type: "text", content: "Cloud-native deployment strategies."}
            }
        ]
    );

    // Query for similar vectors
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.15, 0.25, 0.35]
    });

    if matches is ai:VectorMatch[] {
        foreach ai:VectorMatch m in matches {
            io:println("Match found: ", m);
        }
    }
}
```

## Example 2: Movie Recommendation System

Build a movie recommendation system using Milvus to find similar movies based on vector embeddings.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.milvus;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new milvus:VectorStore(
        serviceUrl = milvusServiceUrl,
        apiKey = milvusApiKey,
        config = {
            collectionName: "movies"
        }
    );

    // Store movie embeddings (in practice, these come from an embedding model)
    check vectorStore.add(
        [
            {
                id: "movie-inception",
                embedding: [0.9, 0.1, 0.8, 0.3],
                chunk: {'type: "text", content: "Inception - A mind-bending sci-fi thriller about dream infiltration."}
            },
            {
                id: "movie-matrix",
                embedding: [0.85, 0.15, 0.75, 0.35],
                chunk: {'type: "text", content: "The Matrix - A hacker discovers reality is a simulation."}
            },
            {
                id: "movie-titanic",
                embedding: [0.2, 0.9, 0.1, 0.8],
                chunk: {'type: "text", content: "Titanic - A love story set aboard the ill-fated ocean liner."}
            }
        ]
    );

    // Find movies similar to "Inception"
    ai:VectorMatch[]|ai:Error recommendations = vectorStore.query({
        embedding: [0.88, 0.12, 0.78, 0.32]
    });

    if recommendations is ai:VectorMatch[] {
        io:println("Recommended movies:");
        foreach ai:VectorMatch movie in recommendations {
            io:println("  - ", movie.chunk.content);
        }
    }
}
```

## Example 3: RAG Pipeline with Milvus

Use Milvus as the retrieval layer in a RAG pipeline with an LLM.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.milvus;
import ballerinax/ai.openai;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;
configurable string openAiApiKey = ?;

public function main() returns error? {
    // Initialize vector store and LLM
    ai:VectorStore vectorStore = check new milvus:VectorStore(
        serviceUrl = milvusServiceUrl,
        apiKey = milvusApiKey,
        config = {collectionName: "knowledge_base"}
    );

    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    // Query for relevant context
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.1, 0.2, 0.3]  // Query embedding from user question
    });

    // Build context from matches
    string context = "";
    if matches is ai:VectorMatch[] {
        foreach ai:VectorMatch m in matches {
            context += m.chunk.content + "\n";
        }
    }

    // Send to LLM with retrieved context
    ai:ChatMessage[] messages = [
        {role: "system", content: "Answer based on: " + context},
        {role: "user", content: "What integration patterns are available?"}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 4: Error Handling and Cleanup

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.milvus;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;

public function main() returns error? {
    do {
        ai:VectorStore vectorStore = check new milvus:VectorStore(
            serviceUrl = milvusServiceUrl,
            apiKey = milvusApiKey,
            config = {collectionName: "temp_data"}
        );

        // Add vectors
        check vectorStore.add([
            {
                id: "temp-1",
                embedding: [0.5, 0.5, 0.5],
                chunk: {'type: "text", content: "Temporary data for testing."}
            }
        ]);

        // Query
        ai:VectorMatch[]|ai:Error matches = vectorStore.query({
            embedding: [0.5, 0.5, 0.5]
        });

        if matches is ai:VectorMatch[] {
            io:println("Found ", matches.length(), " matches");
        }

        // Clean up
        ai:Error? deleteResult = vectorStore.delete(["temp-1"]);
        if deleteResult is ai:Error {
            log:printWarn("Cleanup failed", 'error = deleteResult);
        }
    } on fail error e {
        log:printError("Milvus operation failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
