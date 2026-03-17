---
title: "Milvus Vector Store (AI Module) - Setup"
description: "How to set up and configure the ballerinax/ai.milvus connector."
---

# Milvus Vector Store (AI Module) Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running Milvus instance (Docker or Zilliz Cloud)

## Step 1: Set Up a Milvus Instance

### Option A: Using Docker

Start a Milvus standalone instance using Docker:

```bash
# Download the installation script
curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh -o standalone_embed.sh

# Start the Docker container
bash standalone_embed.sh start
```

The default service URL is `http://localhost:19530`.

For detailed installation instructions, see the official Milvus documentation:
- **Linux/macOS**: [Run Milvus in Docker](https://milvus.io/docs/install_standalone-docker.md)
- **Windows**: [Run Milvus in Docker on Windows](https://milvus.io/docs/install_standalone-windows.md)

### Option B: Using Zilliz Cloud

1. Sign up at [Zilliz Cloud](https://cloud.zilliz.com/) and create an account.
2. Create a new cluster from the welcome page.
3. Configure cluster details (name, cloud provider, region).
4. Once the cluster is ready, download the connection credentials.
5. Generate an API key from the API Keys section in your cluster dashboard.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.milvus;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.milvus"
version = "1.0.2"
```

## Step 3: Configure Credentials

```toml
# Config.toml
milvusServiceUrl = "http://localhost:19530"
milvusApiKey = "<your-milvus-api-key>"
```

```ballerina
configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;
```

## Step 4: Initialize the Vector Store

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

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.milvus;

configurable string milvusServiceUrl = ?;
configurable string milvusApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new milvus:VectorStore(
        serviceUrl = milvusServiceUrl,
        apiKey = milvusApiKey,
        config = {
            collectionName: "test_collection"
        }
    );

    io:println("Milvus vector store initialized successfully.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify Milvus is running and the service URL is correct |
| `Authentication error` | Check the API key in `Config.toml` |
| `Collection not found` | The collection is created automatically when vectors are added |
| `Dimension mismatch` | Ensure embedding dimensions match your collection configuration |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
