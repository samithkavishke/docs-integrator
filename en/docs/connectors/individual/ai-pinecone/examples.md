---
title: "Pinecone - Examples"
description: "Code examples for the ballerinax/ai.pinecone connector."
---

# Pinecone Vector Store Examples

## Example 1: Store and Query Vectors

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new pinecone:VectorStore(
        serviceUrl = pineconeServiceUrl,
        apiKey = pineconeApiKey
    );

    // Store vectors
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

## Example 2: RAG Pipeline Integration

Use Pinecone as the retrieval layer in a RAG pipeline.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pinecone;
import ballerinax/ai.openai;

configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;
configurable string openAiApiKey = ?;

public function main() returns error? {
    // Initialize vector store
    ai:VectorStore vectorStore = check new pinecone:VectorStore(
        serviceUrl = pineconeServiceUrl,
        apiKey = pineconeApiKey
    );

    // Initialize LLM
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    // Query for relevant context
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.1, 0.2, 0.3]  // would be actual query embedding
    });

    // Build context from matches and send to LLM
    string context = "Retrieved context from knowledge base.";
    ai:ChatMessage[] messages = [
        {role: "system", content: "Answer based on: " + context},
        {role: "user", content: "How do I implement an API gateway?"}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 3: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;

public function main() returns error? {
    do {
        ai:VectorStore vectorStore = check new pinecone:VectorStore(
            serviceUrl = pineconeServiceUrl,
            apiKey = pineconeApiKey
        );

        ai:VectorMatch[]|ai:Error matches = vectorStore.query({
            embedding: [0.1, 0.2, 0.3]
        });

        if matches is ai:Error {
            log:printError("Query failed", 'error = matches);
        } else {
            io:println("Found ", matches.length(), " matches.");
        }
    } on fail error e {
        log:printError("Pinecone initialization failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
