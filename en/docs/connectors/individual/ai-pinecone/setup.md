---
title: "Pinecone - Setup"
description: "How to set up and configure the ballerinax/ai.pinecone connector."
---

# Pinecone Vector Store Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Pinecone account at [pinecone.io](https://www.pinecone.io/start/)
- A Pinecone index created through the Pinecone Console

## Step 1: Create a Pinecone Account and Index

1. Create a [Pinecone account](https://www.pinecone.io/start/).
2. Open the [Pinecone Console](https://app.pinecone.io/).
3. Create a new index:
   - Choose a name for your index
   - Set the vector dimension (e.g., 1536 for OpenAI embeddings, 768 for many open-source models)
   - Select a similarity metric (cosine, euclidean, or dot product)
   - Choose your cloud provider and region
4. Copy the **API Key** from the console.
5. Copy the **Index Service URL** from the index details page.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.pinecone;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.pinecone"
version = "1.1.2"
```

## Step 3: Configure Credentials

```toml
# Config.toml
pineconeApiKey = "<your-pinecone-api-key>"
pineconeServiceUrl = "https://<your-index-name>.svc.<region>.pinecone.io"
```

```ballerina
configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;
```

## Step 4: Initialize the Vector Store

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

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string pineconeApiKey = ?;
configurable string pineconeServiceUrl = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new pinecone:VectorStore(
        serviceUrl = pineconeServiceUrl,
        apiKey = pineconeApiKey
    );

    io:println("Pinecone vector store initialized successfully.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Authentication error` | Verify your API key in `Config.toml` |
| `Index not found` | Check the service URL matches your index |
| `Dimension mismatch` | Ensure embedding dimensions match your index configuration |
| `Connection timeout` | Verify network connectivity to Pinecone cloud |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
