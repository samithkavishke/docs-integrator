---
title: "Pinecone Vector Store"
description: "Overview of the ballerinax/ai.pinecone connector for WSO2 Integrator."
---

# Pinecone Vector Store

| | |
|---|---|
| **Package** | [`ballerinax/ai.pinecone`](https://central.ballerina.io/ballerinax/ai.pinecone/latest) |
| **Version** | latest |
| **Category** | AI & ML |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.pinecone/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.pinecone/latest) |

## Overview

Connect to Pinecone Vector Store from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/ai.pinecone;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "ai.pinecone"
version = "latest"
```

## When to Use

Use the Pinecone Vector Store connector when your integration needs to:

- Store and query vector embeddings for similarity search
- Build RAG (Retrieval-Augmented Generation) pipelines
- Power semantic search in your applications
- Integrate with AI/ML workflows

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/ai.pinecone/latest)
