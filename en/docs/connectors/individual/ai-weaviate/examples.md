---
title: "Weaviate Vector Store (AI Module) - Examples"
description: "Code examples for the ballerinax/ai.weaviate connector."
---

# Weaviate Vector Store (AI Module) Examples

## Example 1: Store and Query Vectors

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.weaviate;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new weaviate:VectorStore(
        serviceUrl = weaviateServiceUrl,
        config = {
            collectionName: "Articles"
        },
        apiKey = weaviateApiKey
    );

    // Store document embeddings
    check vectorStore.add(
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
                chunk: {'type: "text", content: "API gateway design best practices."}
            }
        ]
    );

    // Query for similar articles
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.15, 0.25, 0.35]
    });

    if matches is ai:VectorMatch[] {
        io:println("Found ", matches.length(), " matching articles:");
        foreach ai:VectorMatch m in matches {
            io:println("  - ", m.chunk.content);
        }
    }
}
```

```toml
# Config.toml
weaviateServiceUrl = "https://your-cluster.weaviate.network"
weaviateApiKey = "<your-api-key>"
```

## Example 2: Book Recommendation System

Build a book recommendation system using Weaviate to find similar books.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.weaviate;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new weaviate:VectorStore(
        serviceUrl = weaviateServiceUrl,
        config = {collectionName: "Books"},
        apiKey = weaviateApiKey
    );

    // Store book embeddings
    check vectorStore.add([
        {
            id: "book-dune",
            embedding: [0.9, 0.1, 0.8, 0.2],
            chunk: {'type: "text", content: "Dune - A science fiction epic about politics, religion, and ecology on a desert planet."}
        },
        {
            id: "book-foundation",
            embedding: [0.85, 0.15, 0.75, 0.25],
            chunk: {'type: "text", content: "Foundation - A mathematical scientist predicts the fall of a galactic empire."}
        },
        {
            id: "book-pride",
            embedding: [0.2, 0.9, 0.1, 0.8],
            chunk: {'type: "text", content: "Pride and Prejudice - A classic romance exploring social class in Regency England."}
        }
    ]);

    // Find books similar to "Dune"
    ai:VectorMatch[]|ai:Error recommendations = vectorStore.query({
        embedding: [0.88, 0.12, 0.78, 0.22]
    });

    if recommendations is ai:VectorMatch[] {
        io:println("Recommended books:");
        foreach ai:VectorMatch book in recommendations {
            io:println("  - ", book.chunk.content);
        }
    }
}
```

## Example 3: RAG Pipeline with Weaviate

Use Weaviate as the retrieval layer in a RAG pipeline with an LLM.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.weaviate;
import ballerinax/ai.openai;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;
configurable string openAiApiKey = ?;

public function main() returns error? {
    // Initialize vector store and LLM
    ai:VectorStore vectorStore = check new weaviate:VectorStore(
        serviceUrl = weaviateServiceUrl,
        config = {collectionName: "KnowledgeBase"},
        apiKey = weaviateApiKey
    );

    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    // Retrieve relevant context
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.1, 0.2, 0.3]
    });

    string context = "";
    if matches is ai:VectorMatch[] {
        foreach ai:VectorMatch m in matches {
            context += m.chunk.content + "\n";
        }
    }

    // Generate response with retrieved context
    ai:ChatMessage[] messages = [
        {role: "system", content: "Answer based on the following context:\n" + context},
        {role: "user", content: "What are the best practices for API design?"}
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
import ballerinax/ai.weaviate;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;

public function main() returns error? {
    do {
        ai:VectorStore vectorStore = check new weaviate:VectorStore(
            serviceUrl = weaviateServiceUrl,
            config = {collectionName: "TempData"},
            apiKey = weaviateApiKey
        );

        // Add test vectors
        check vectorStore.add([
            {
                id: "temp-1",
                embedding: [0.5, 0.5, 0.5],
                chunk: {'type: "text", content: "Temporary test data."}
            }
        ]);

        // Query to verify
        ai:VectorMatch[]|ai:Error matches = vectorStore.query({
            embedding: [0.5, 0.5, 0.5]
        });

        if matches is ai:VectorMatch[] {
            io:println("Found ", matches.length(), " matches");
        }

        // Clean up
        check vectorStore.delete(["temp-1"]);
        io:println("Cleanup complete");
    } on fail error e {
        log:printError("Weaviate operation failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
