---
title: "Pinecone - Actions"
description: "Available actions and operations for the ballerinax/ai.pinecone connector."
---

# Pinecone Vector Store Actions

The `ballerinax/ai.pinecone` module provides a `VectorStore` that implements the `ai:VectorStore` interface for Pinecone vector database operations.

## Vector Store Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;

ai:VectorStore vectorStore = check new pinecone:VectorStore(
    serviceUrl = pineconeServiceUrl,
    apiKey = pineconeApiKey
);
```

## add()

Store vector embeddings with associated metadata and content chunks.

```ballerina
ai:Error? result = vectorStore.add(
    [
        {
            id: "doc-1",
            embedding: [0.1, 0.2, 0.3, ...],  // vector matching index dimension
            chunk: {
                'type: "text",
                content: "Ballerina is a cloud-native programming language."
            }
        },
        {
            id: "doc-2",
            embedding: [0.4, 0.5, 0.6, ...],
            chunk: {
                'type: "text",
                content: "WSO2 Integrator provides enterprise integration capabilities."
            }
        }
    ]
);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `entries` | `ai:VectorEntry[]` | Array of vector entries to store |

Each `ai:VectorEntry` contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the vector |
| `embedding` | `float[]` | Vector embedding array |
| `chunk` | `ai:Chunk` | Associated content chunk |

## query()

Search for vectors similar to a given query embedding.

```ballerina
ai:VectorMatch[]|ai:Error matches = vectorStore.query({
    embedding: [0.1, 0.2, 0.3, ...],  // query vector
    filters: {}  // optional metadata filters
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `queryParams` | `ai:VectorQuery` | Query configuration with embedding and optional filters |

### Response

Returns `ai:VectorMatch[]` containing matched results ranked by similarity score.

## delete()

Remove vectors from the store by their IDs.

```ballerina
ai:Error? result = vectorStore.delete(["doc-1", "doc-2"]);
```

## Error Handling

```ballerina
do {
    ai:VectorMatch[]|ai:Error matches = vectorStore.query({
        embedding: queryVector
    });
    if matches is ai:VectorMatch[] {
        foreach ai:VectorMatch m in matches {
            io:println("Match: ", m);
        }
    }
} on fail error e {
    io:println("Pinecone error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
