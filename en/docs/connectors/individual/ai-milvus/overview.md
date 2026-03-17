---
title: "Milvus Vector Store (AI Module)"
description: "Overview of the ballerinax/ai.milvus connector for WSO2 Integrator."
---

# Milvus Vector Store (AI Module)

| | |
|---|---|
| **Package** | [`ballerinax/ai.milvus`](https://central.ballerina.io/ballerinax/ai.milvus/latest) |
| **Version** | 1.0.2 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.milvus/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.milvus/latest#functions) |

## Overview

The `ballerinax/ai.milvus` module provides a vector store implementation for integrating with the Milvus vector database. It implements the `ai:VectorStore` interface from the `ballerina/ai` module, enabling seamless use within the Ballerina AI ecosystem for RAG (Retrieval-Augmented Generation) pipelines and similarity search applications.

Milvus is an open-source vector database built for scalable similarity search and AI applications. It provides high-performance vector storage and retrieval capabilities with support for dense, sparse, and hybrid vector search modes.

## Key Features

- **VectorStore Interface** -- Implements `ai:VectorStore` for standardized AI module integration
- **Vector Storage** -- Store high-dimensional embedding vectors with associated metadata and content chunks
- **Similarity Search** -- Query vectors to find the most similar entries using multiple search algorithms
- **Dense, Sparse, and Hybrid Search** -- Support for multiple vector search modes
- **Collection Management** -- Organize vectors into collections with configurable dimensions
- **Cloud and Self-Hosted** -- Works with Milvus Docker instances or Zilliz Cloud managed service

## Use Cases

- **RAG Pipelines** -- Store document embeddings and retrieve relevant context for LLM responses
- **Semantic Search** -- Find documents, products, or content by meaning rather than keywords
- **Recommendation Systems** -- Build recommendation engines using vector similarity matching
- **Image and Media Search** -- Store and search image/audio embeddings for content discovery
- **Knowledge Base** -- Build searchable knowledge bases from unstructured enterprise data

## Quick Start

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

## Architecture

The `ai.milvus` module acts as the retrieval layer in AI-powered applications:

1. **Embedding Generation** -- Use an LLM provider (OpenAI, Azure OpenAI) to generate vector embeddings
2. **Vector Storage** -- Store embeddings in Milvus collections via the `add()` operation
3. **Similarity Search** -- Query the store to find relevant vectors using `query()`
4. **Context Retrieval** -- Feed matched content back to LLMs as context for generation

## Related Resources

- [Setup Guide](setup) -- Milvus instance and collection configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Milvus Documentation](https://milvus.io/docs/) -- Official Milvus docs
- [Zilliz Cloud](https://cloud.zilliz.com/) -- Managed Milvus service
