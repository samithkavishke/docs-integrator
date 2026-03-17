---
title: "pgvector Vector Store (AI Module)"
description: "Overview of the ballerinax/ai.pgvector connector for WSO2 Integrator."
---

# pgvector Vector Store (AI Module)

| | |
|---|---|
| **Package** | [`ballerinax/ai.pgvector`](https://central.ballerina.io/ballerinax/ai.pgvector/latest) |
| **Version** | 1.0.3 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.pgvector/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.pgvector/latest#functions) |

## Overview

The `ballerinax/ai.pgvector` module provides a vector store implementation backed by PostgreSQL with the pgvector extension. It implements the `ai:VectorStore` interface from the `ballerina/ai` module, allowing you to store, retrieve, and search high-dimensional vectors using familiar PostgreSQL infrastructure.

pgvector is a PostgreSQL extension that introduces a vector data type and similarity search capabilities, making it possible to use your existing PostgreSQL deployment for AI workloads without introducing a separate vector database.

## Key Features

- **VectorStore Interface** -- Implements `ai:VectorStore` for standardized AI module integration
- **PostgreSQL-Based** -- Leverage existing PostgreSQL infrastructure for vector storage
- **Similarity Search** -- Perform cosine, L2 distance, and inner product similarity searches
- **Configurable Dimensions** -- Set vector dimensions to match your embedding model output
- **SQL Integration** -- Combine vector search with traditional SQL queries and filtering
- **Proven Infrastructure** -- Built on PostgreSQL's reliability, backups, and replication

## Use Cases

- **RAG Pipelines** -- Store document embeddings and retrieve relevant context for LLM responses
- **Semantic Search** -- Add vector search to existing PostgreSQL-based applications
- **Hybrid Search** -- Combine vector similarity with structured metadata filtering in SQL
- **Cost-Effective AI** -- Avoid managing separate vector database infrastructure
- **Existing PostgreSQL Apps** -- Add AI capabilities to applications already using PostgreSQL

## Quick Start

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

## Architecture

The `ai.pgvector` module uses PostgreSQL as the vector storage backend:

1. **Table Creation** -- Automatically creates a table with a vector column matching the configured dimension
2. **Vector Indexing** -- pgvector creates indexes for efficient similarity search
3. **Query Execution** -- Similarity searches are translated into PostgreSQL queries using pgvector operators
4. **Result Ranking** -- Results are ranked by similarity score (cosine, L2, or inner product)

## Related Resources

- [Setup Guide](setup) -- PostgreSQL and pgvector setup
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [pgvector GitHub](https://github.com/pgvector/pgvector) -- Official pgvector repository
