---
title: "pgvector Vector Store (AI Module) - Actions"
description: "Available actions and operations for the ballerinax/ai.pgvector connector."
---

# pgvector Vector Store (AI Module) Actions

The `ballerinax/ai.pgvector` module provides a `VectorStore` that implements the `ai:VectorStore` interface for PostgreSQL with the pgvector extension.

## Vector Store Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

ai:VectorStore vectorStore = check new pgvector:VectorStore(
    host,
    user,
    password,
    database,
    "embeddings",
    configs = {
        vectorDimension: 1536
    }
);
```

### Constructor Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `host` | `string` | PostgreSQL server hostname |
| `user` | `string` | Database username |
| `password` | `string` | Database password |
| `database` | `string` | Database name |
| `tableName` | `string` | Table name for storing vectors |
| `configs` | `record` | Configuration including `vectorDimension` |

## add()

Store vector embeddings with associated metadata and content chunks in the PostgreSQL table.

```ballerina
ai:Error? result = vectorStore.add(
    [
        {
            id: "doc-1",
            embedding: [1.0, 2.0, 3.0],
            chunk: {
                'type: "text",
                content: "PostgreSQL is a powerful relational database."
            }
        },
        {
            id: "doc-2",
            embedding: [4.0, 5.0, 6.0],
            chunk: {
                'type: "text",
                content: "pgvector adds vector similarity search to PostgreSQL."
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
| `embedding` | `float[]` | Vector embedding array (must match configured dimension) |
| `chunk` | `ai:Chunk` | Associated content chunk |

## query()

Search for vectors similar to a given query embedding using PostgreSQL similarity operators.

```ballerina
ai:VectorMatch[]|ai:Error matches = vectorStore.query({
    embedding: [1.0, 2.0, 3.0],
    filters: {}
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `queryParams` | `ai:VectorQuery` | Query configuration with embedding and optional filters |

### Response

Returns `ai:VectorMatch[]` containing matched results ranked by similarity score.

| Field | Type | Description |
|-------|------|-------------|
| `chunk` | `ai:Chunk` | The matched content chunk |
| `score` | `float` | Similarity score |

## delete()

Remove vectors from the PostgreSQL table by their IDs.

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
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public function main() returns error? {
    do {
        ai:VectorStore vectorStore = check new pgvector:VectorStore(
            host, user, password, database, "embeddings",
            configs = {vectorDimension: 3}
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
        log:printError("pgvector initialization failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
