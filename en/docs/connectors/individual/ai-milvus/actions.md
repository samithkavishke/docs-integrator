---
title: "Milvus Vector Store (AI Module) - Actions"
description: "Available actions and operations for the ballerinax/ai.milvus connector."
---

# Milvus Vector Store (AI Module) Actions

The `ballerinax/ai.milvus` module provides a `VectorStore` that implements the `ai:VectorStore` interface for Milvus vector database operations.

## Vector Store Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.milvus;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;

ai:VectorStore vectorStore = check new milvus:VectorStore(
    serviceUrl = milvusServiceUrl,
    apiKey = milvusApiKey,
    config = {
        collectionName: "my_collection"
    }
);
```

### Configuration Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceUrl` | `string` | Milvus server URL (e.g., `http://localhost:19530` or Zilliz Cloud URL) |
| `apiKey` | `string` | API key for authentication |
| `config` | `record` | Collection configuration including `collectionName` |

## add()

Store vector embeddings with associated metadata and content chunks in a Milvus collection.

```ballerina
ai:Error? result = vectorStore.add(
    [
        {
            id: "doc-1",
            embedding: [1.0, 2.0, 3.0],
            chunk: {
                'type: "text",
                content: "Ballerina is a cloud-native programming language."
            }
        },
        {
            id: "doc-2",
            embedding: [4.0, 5.0, 6.0],
            chunk: {
                'type: "text",
                content: "Milvus provides high-performance vector similarity search."
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

Search for vectors similar to a given query embedding using similarity search.

```ballerina
ai:VectorMatch[]|ai:Error matches = vectorStore.query({
    embedding: [1.1, 2.1, 3.1],
    filters: {}
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `queryParams` | `ai:VectorQuery` | Query configuration with embedding and optional metadata filters |

### Response

Returns `ai:VectorMatch[]` containing matched results ranked by similarity score.

| Field | Type | Description |
|-------|------|-------------|
| `chunk` | `ai:Chunk` | The matched content chunk |
| `score` | `float` | Similarity score |

## delete()

Remove vectors from the Milvus collection by their IDs.

```ballerina
ai:Error? result = vectorStore.delete(["doc-1", "doc-2"]);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ids` | `string[]` | Array of vector IDs to delete |

## Error Handling

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
            config = {collectionName: "test"}
        );

        ai:VectorMatch[]|ai:Error matches = vectorStore.query({
            embedding: [1.0, 2.0, 3.0]
        });

        if matches is ai:VectorMatch[] {
            foreach ai:VectorMatch m in matches {
                io:println("Match: ", m);
            }
        } else {
            log:printError("Query failed", 'error = matches);
        }
    } on fail error e {
        log:printError("Milvus initialization failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
