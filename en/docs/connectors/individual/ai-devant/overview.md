---
title: "Devant Document Processing"
description: "Overview of the ballerinax/ai.devant connector for WSO2 Integrator."
---

# Devant Document Processing (AI Module)

| | |
|---|---|
| **Package** | [`ballerinax/ai.devant`](https://central.ballerina.io/ballerinax/ai.devant/latest) |
| **Version** | 1.0.2 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.devant/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.devant/latest#functions) |

## Overview

The `ballerinax/ai.devant` module provides APIs to interact with [Devant by WSO2](https://wso2.com/devant/), enabling document chunking and loading for AI-powered applications. It integrates with the [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) module to provide document processing capabilities essential for Retrieval-Augmented Generation (RAG) pipelines.

Devant is WSO2's AI service platform that provides intelligent document processing, including chunking documents into semantically meaningful segments that can be embedded and stored in vector databases for retrieval.

## Key Features

- **Document Loading** -- Load documents from local files in formats such as PDF, text, and more using `BinaryDataLoader`
- **Intelligent Chunking** -- Break documents into semantically meaningful chunks using the Devant AI chunking service
- **AI Module Integration** -- Produces `ai:Document` and `ai:Chunk` types compatible with the Ballerina AI ecosystem
- **RAG Pipeline Support** -- Designed as the ingestion layer for RAG workflows, feeding into vector stores
- **Multiple File Formats** -- Support for PDF, plain text, and other binary document formats

## Use Cases

- **RAG Document Ingestion** -- Load and chunk documents before embedding and storing in vector databases
- **Knowledge Base Construction** -- Process large document collections into searchable chunk repositories
- **Document Preprocessing** -- Prepare unstructured documents for AI-powered search and question answering
- **Content Indexing** -- Break down enterprise documents for indexing in search systems

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    // Load a document from the filesystem
    devant:BinaryDataLoader loader = check new ("./sample.pdf");
    ai:Document|ai:Document[] docs = check loader.load();

    // Chunk the document using the Devant service
    devant:Chunker chunker = new (serviceUrl, accessToken);
    if docs is ai:Document {
        ai:Chunk[] chunks = check chunker.chunk(docs);
    }
}
```

## Architecture

The `ai.devant` module fits into a typical RAG pipeline as follows:

1. **Load** -- Use `BinaryDataLoader` to read documents from the filesystem
2. **Chunk** -- Use `Chunker` to split documents into semantically meaningful segments via the Devant AI service
3. **Embed** -- Pass chunks to an embedding model (e.g., OpenAI, Azure OpenAI)
4. **Store** -- Store embeddings in a vector store (e.g., Pinecone, Milvus, pgvector)
5. **Retrieve** -- Query the vector store to find relevant chunks for LLM context

## Related Resources

- [Setup Guide](setup) -- Devant service URL and access token configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Devant Platform](https://wso2.com/devant/) -- WSO2 Devant documentation
