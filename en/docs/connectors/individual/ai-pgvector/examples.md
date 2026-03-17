---
title: "pgvector Vector Store (AI Module) - Examples"
description: "Code examples for the ballerinax/ai.pgvector connector."
---

# pgvector Vector Store (AI Module) Examples

## Example 1: Store and Query Vectors

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new pgvector:VectorStore(
        host, user, password, database, "documents",
        configs = {vectorDimension: 3}
    );

    // Store document embeddings
    check vectorStore.add(
        [
            {
                id: "doc-1",
                embedding: [0.1, 0.2, 0.3],
                chunk: {'type: "text", content: "Introduction to REST API design."}
            },
            {
                id: "doc-2",
                embedding: [0.4, 0.5, 0.6],
                chunk: {'type: "text", content: "GraphQL vs REST architecture comparison."}
            },
            {
                id: "doc-3",
                embedding: [0.7, 0.8, 0.9],
                chunk: {'type: "text", content: "Microservices communication patterns."}
            }
        ]
    );

    // Query for similar documents
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.15, 0.25, 0.35]
    });

    if matches is ai:VectorMatch[] {
        io:println("Found ", matches.length(), " matches:");
        foreach ai:VectorMatch m in matches {
            io:println("  - ", m.chunk.content);
        }
    }
}
```

```toml
# Config.toml
host = "localhost"
user = "postgres"
password = "mypassword"
database = "vector_db"
```

## Example 2: RAG Pipeline with pgvector

Use pgvector as the retrieval backend in a RAG pipeline for question answering.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pgvector;
import ballerinax/ai.openai;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;
configurable string openAiApiKey = ?;

public function main() returns error? {
    // Initialize vector store and LLM
    ai:VectorStore vectorStore = check new pgvector:VectorStore(
        host, user, password, database, "knowledge_base",
        configs = {vectorDimension: 3}
    );

    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    // Ingest documents
    check vectorStore.add([
        {
            id: "policy-1",
            embedding: [0.9, 0.1, 0.5],
            chunk: {'type: "text", content: "Employees are entitled to 20 days of annual leave."}
        },
        {
            id: "policy-2",
            embedding: [0.8, 0.2, 0.6],
            chunk: {'type: "text", content: "Remote work requires manager approval and VPN access."}
        }
    ]);

    // Retrieve relevant context
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: [0.85, 0.15, 0.55]
    });

    string context = "";
    if matches is ai:VectorMatch[] {
        foreach ai:VectorMatch m in matches {
            context += m.chunk.content + "\n";
        }
    }

    // Generate answer with context
    ai:ChatMessage[] messages = [
        {role: "system", content: "Answer based on company policy: " + context},
        {role: "user", content: "How many days of annual leave do I get?"}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 3: Add Vectors to Existing PostgreSQL Application

Enhance an existing PostgreSQL-based application with semantic search.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public function main() returns error? {
    // Use the same PostgreSQL database as your application
    ai:VectorStore vectorStore = check new pgvector:VectorStore(
        host, user, password, database, "product_embeddings",
        configs = {vectorDimension: 4}
    );

    // Index product descriptions as vectors
    check vectorStore.add([
        {
            id: "prod-laptop",
            embedding: [0.9, 0.3, 0.7, 0.1],
            chunk: {'type: "text", content: "Lightweight laptop with 16GB RAM and 512GB SSD."}
        },
        {
            id: "prod-tablet",
            embedding: [0.8, 0.4, 0.6, 0.2],
            chunk: {'type: "text", content: "10-inch tablet with stylus support and all-day battery."}
        },
        {
            id: "prod-monitor",
            embedding: [0.5, 0.8, 0.3, 0.6],
            chunk: {'type: "text", content: "27-inch 4K monitor with USB-C connectivity."}
        }
    ]);

    // Search products by semantic meaning
    ai:VectorMatch[]|ai:Error results = vectorStore.query({
        embedding: [0.85, 0.35, 0.65, 0.15]  // "portable computing device"
    });

    if results is ai:VectorMatch[] {
        io:println("Products matching your search:");
        foreach ai:VectorMatch r in results {
            io:println("  - ", r.chunk.content);
        }
    }
}
```

## Example 4: Error Handling and Cleanup

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public function main() returns error? {
    do {
        ai:VectorStore vectorStore = check new pgvector:VectorStore(
            host, user, password, database, "test_vectors",
            configs = {vectorDimension: 3}
        );

        // Add test data
        check vectorStore.add([
            {
                id: "test-1",
                embedding: [0.5, 0.5, 0.5],
                chunk: {'type: "text", content: "Test document for verification."}
            }
        ]);

        // Verify query works
        ai:VectorMatch[]|ai:Error matches = vectorStore.query({
            embedding: [0.5, 0.5, 0.5]
        });

        if matches is ai:VectorMatch[] {
            io:println("Query successful: ", matches.length(), " results");
        }

        // Clean up test data
        check vectorStore.delete(["test-1"]);
        io:println("Test data cleaned up successfully");
    } on fail error e {
        log:printError("pgvector operation failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
