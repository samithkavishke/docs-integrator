---
title: "Milvus Vector Database"
description: "Overview of the ballerinax/milvus connector for WSO2 Integrator."
---

# Milvus Vector Database

| | |
|---|---|
| **Package** | [`ballerinax/milvus`](https://central.ballerina.io/ballerinax/milvus/latest) |
| **Version** | latest |
| **Category** | AI & ML |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/milvus/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/milvus/latest) |

## Overview

Connect to Milvus Vector Database from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/milvus;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "milvus"
version = "latest"
```

## When to Use

Use the Milvus Vector Database connector when your integration needs to:

- Store and query vector embeddings for similarity search
- Build RAG (Retrieval-Augmented Generation) pipelines
- Power semantic search in your applications
- Integrate with AI/ML workflows

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/milvus/latest)
