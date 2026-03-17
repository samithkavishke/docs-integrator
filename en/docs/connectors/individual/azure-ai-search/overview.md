---
title: "Azure AI Search"
description: "Overview of the ballerinax/azure.ai.search connector for WSO2 Integrator."
---

# Azure AI Search

| | |
|---|---|
| **Package** | [`ballerinax/azure.ai.search`](https://central.ballerina.io/ballerinax/azure.ai.search/latest) |
| **Version** | 1.0.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure.ai.search/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure.ai.search/latest#functions) |

## Overview

The `ballerinax/azure.ai.search` package provides a connector for interacting with [Azure AI Search](https://azure.microsoft.com/products/ai-services/ai-search/) (formerly Azure Cognitive Search). Azure AI Search is a cloud search service that provides developers with infrastructure, APIs, and tools for building rich search experiences over private, heterogeneous content in web, mobile, and enterprise applications.

This connector enables you to create and manage search indexes, index documents, and perform full-text and vector search queries against your Azure AI Search service.

## Key Features

- **Index Management** -- Create, update, and delete search indexes with custom schemas
- **Document Indexing** -- Upload, merge, and delete documents in search indexes
- **Full-Text Search** -- Perform rich full-text search queries with filters and facets
- **Vector Search** -- Execute vector similarity searches for AI-powered semantic retrieval
- **Data Source Management** -- Configure data sources for automatic indexing
- **Indexer Management** -- Set up and run indexers to automatically pull data from sources
- **Skillsets** -- Define AI enrichment pipelines for cognitive processing

## Use Cases

- **Enterprise Search** -- Build powerful search experiences across organizational content
- **RAG Pipelines** -- Use Azure AI Search as the retrieval layer in Retrieval-Augmented Generation workflows
- **E-Commerce Search** -- Implement product search with filtering, faceting, and ranking
- **Document Search** -- Search across large document repositories with full-text and semantic capabilities
- **Knowledge Mining** -- Extract insights from unstructured data using AI enrichment

## Quick Start

```ballerina
import ballerinax/azure.ai.search as azureSearch;

configurable string serviceUrl = ?;
configurable string adminKey = ?;

final azureSearch:Client searchClient = check new (serviceUrl, {});
```

## Architecture

Azure AI Search integrates with various data sources and provides multiple search capabilities:

1. **Data Sources** -- Connect to Azure Blob Storage, Azure SQL, Cosmos DB, and more
2. **Indexers** -- Automatically pull and index data from configured data sources
3. **Indexes** -- Define searchable schemas with fields, analyzers, and scoring profiles
4. **Search Queries** -- Execute full-text, filter, vector, and hybrid search queries
5. **AI Enrichment** -- Apply cognitive skills to enrich data during indexing

## Related Resources

- [Setup Guide](setup) -- Azure account and service configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Azure AI Search Documentation](https://learn.microsoft.com/azure/search/) -- Official Azure docs
