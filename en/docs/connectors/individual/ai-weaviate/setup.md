---
title: "Weaviate Vector Store (AI Module) - Setup"
description: "How to set up and configure the ballerinax/ai.weaviate connector."
---

# Weaviate Vector Store (AI Module) Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Weaviate instance (Weaviate Cloud or self-hosted Docker)

## Step 1: Set Up a Weaviate Instance

### Option A: Using Weaviate Cloud

1. Visit [weaviate.io](https://weaviate.io/) and sign up for a free account.
2. Log into the [Weaviate Console](https://console.weaviate.cloud/) and click **Create Cluster**.
3. Configure cluster details (cluster name, cloud provider, region).
4. Wait for the cluster to be provisioned (2-3 minutes).
5. Copy the **REST endpoint URL** from your cluster dashboard -- this is your `serviceUrl`.
6. Navigate to **API Keys**, click **Create API Key**, and save the generated key.

### Option B: Using Docker

Run a local Weaviate instance using Docker:

```bash
docker run -d \
  --name weaviate \
  -p 8080:8080 \
  -p 50051:50051 \
  cr.weaviate.io/semitechnologies/weaviate:latest \
  --host 0.0.0.0 \
  --port 8080 \
  --scheme http
```

The default service URL is `http://localhost:8080`.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.weaviate;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.weaviate"
version = "1.0.2"
```

## Step 3: Configure Credentials

```toml
# Config.toml
weaviateServiceUrl = "https://your-cluster.weaviate.network"
weaviateApiKey = "<your-weaviate-api-key>"
```

```ballerina
configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;
```

## Step 4: Initialize the Vector Store

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

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.weaviate;

configurable string weaviateServiceUrl = ?;
configurable string weaviateApiKey = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new weaviate:VectorStore(
        serviceUrl = weaviateServiceUrl,
        config = {
            collectionName: "TestCollection"
        },
        apiKey = weaviateApiKey
    );

    io:println("Weaviate vector store initialized successfully.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify the Weaviate instance is running and the service URL is correct |
| `Authentication error` | Check the API key in `Config.toml` |
| `Collection not found` | The collection is created automatically when vectors are added |
| `Timeout error` | Verify network connectivity to the Weaviate cluster |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
