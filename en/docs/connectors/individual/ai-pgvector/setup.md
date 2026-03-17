---
title: "pgvector Vector Store (AI Module) - Setup"
description: "How to set up and configure the ballerinax/ai.pgvector connector."
---

# pgvector Vector Store (AI Module) Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A PostgreSQL instance with the pgvector extension enabled

## Step 1: Set Up PostgreSQL with pgvector

### Using Docker (Recommended)

Start a PostgreSQL instance with pgvector pre-installed:

```bash
docker run --name pgvector-db \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=vector_db \
  -p 5432:5432 \
  -d pgvector/pgvector:pg17
```

### Using an Existing PostgreSQL Instance

Connect to your PostgreSQL database and enable the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

> **Note**: The pgvector extension must be installed on your PostgreSQL server. See the [pgvector installation guide](https://github.com/pgvector/pgvector#installation) for details.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.pgvector;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.pgvector"
version = "1.0.3"
```

## Step 3: Configure Credentials

```toml
# Config.toml
host = "localhost"
user = "postgres"
password = "mypassword"
database = "vector_db"
```

```ballerina
configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;
```

## Step 4: Initialize the Vector Store

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
    "embeddings",    // table name
    configs = {
        vectorDimension: 1536  // must match your embedding model
    }
);
```

### Configuration Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `host` | `string` | PostgreSQL server hostname |
| `user` | `string` | Database username |
| `password` | `string` | Database password |
| `database` | `string` | Database name |
| `tableName` | `string` | Name of the table to store vectors |
| `configs.vectorDimension` | `int` | Dimension of the embedding vectors (e.g., 1536 for OpenAI) |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

public function main() returns error? {
    ai:VectorStore vectorStore = check new pgvector:VectorStore(
        host, user, password, database, "test_table",
        configs = {vectorDimension: 3}
    );

    io:println("pgvector vector store initialized successfully.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify PostgreSQL is running and accessible on the configured host/port |
| `Extension not found` | Run `CREATE EXTENSION IF NOT EXISTS vector;` in your database |
| `Authentication failed` | Verify username and password in `Config.toml` |
| `Dimension mismatch` | Ensure `vectorDimension` matches your embedding model output size |
| `Database not found` | Create the database first: `CREATE DATABASE vector_db;` |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
