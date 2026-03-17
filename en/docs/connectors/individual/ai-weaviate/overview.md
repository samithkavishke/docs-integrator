---
title: "Weaviate Vector Store (AI Module)"
description: "Overview of the ballerinax/ai.weaviate connector for WSO2 Integrator."
---

# Weaviate Vector Store (AI Module)

| | |
|---|---|
| **Package** | [`ballerinax/ai.weaviate`](https://central.ballerina.io/ballerinax/ai.weaviate/latest) |
| **Version** | 1.0.2 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.weaviate/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.weaviate/latest#functions) |

## Overview

The `ballerinax/ai.weaviate` module provides a vector store implementation for integrating with the Weaviate vector database. It implements the `ai:VectorStore` interface from the `ballerina/ai` module, enabling seamless use within the Ballerina AI ecosystem for RAG (Retrieval-Augmented Generation) pipelines and similarity search applications.

Weaviate is an open-source vector database that stores both objects and vectors, allowing you to combine vector search with structured filtering at cloud-native scale. It supports multiple search modes and offers built-in vectorization capabilities.

## Key Features

- **VectorStore Interface** -- Implements `ai:VectorStore` for standardized AI module integration
- **Vector and Object Storage** -- Store vectors alongside structured data and metadata
- **Similarity Search** -- Query vectors to find the most similar entries
- **Collection-Based Organization** -- Organize data into named collections
- **Cloud and Self-Hosted** -- Works with Weaviate Cloud or self-hosted Docker instances
- **RAG Integration** -- Use as the retrieval layer in Retrieval-Augmented Generation pipelines

## Use Cases

- **RAG Pipelines** -- Store document embeddings and retrieve relevant context for LLM responses
- **Semantic Search** -- Find documents, products, or content by meaning rather than keywords
- **Recommendation Systems** -- Match items based on vector similarity for personalized recommendations
- **Knowledge Base** -- Build searchable knowledge bases from unstructured data
- **Multi-Modal Search** -- Combine vector search with metadata filtering

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.weaviate;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;

ai:VectorStore vectorStore = check new weaviate:VectorStore(
    serviceUrl = weaviateServiceUrl,
    config = {
        collectionName: "Documents"
    },
    apiKey = weaviateApiKey
);
```

## Architecture

The `ai.weaviate` module acts as the retrieval layer in AI-powered applications:

1. **Embedding Generation** -- Use an LLM provider (OpenAI, Azure OpenAI) to generate vector embeddings
2. **Vector Storage** -- Store embeddings in Weaviate collections via the `add()` operation
3. **Similarity Search** -- Query the store to find relevant vectors using `query()`
4. **Context Retrieval** -- Feed matched content back to LLMs as context for generation

## Related Resources

- [Setup Guide](setup) -- Weaviate account and cluster configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Weaviate Documentation](https://weaviate.io/developers/weaviate) -- Official Weaviate docs
- [Weaviate Cloud](https://console.weaviate.cloud/) -- Managed Weaviate service
