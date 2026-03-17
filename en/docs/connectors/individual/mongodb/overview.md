---
title: "MongoDB"
description: "Overview of the ballerinax/mongodb connector for WSO2 Integrator."
---

# MongoDB Connector

| | |
|---|---|
| **Package** | [`ballerinax/mongodb`](https://central.ballerina.io/ballerinax/mongodb/latest) |
| **Version** | 5.2.3 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/mongodb/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/mongodb/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-mongodb) |

## Overview

The `ballerinax/mongodb` connector provides APIs to connect to MongoDB servers and perform various operations including CRUD operations, indexing, and aggregation pipelines. Unlike SQL-based connectors, MongoDB uses a document-oriented model where data is stored as flexible JSON-like BSON documents.

The connector is compatible with MongoDB 3.6 and later versions, and supports both local MongoDB installations and MongoDB Atlas (cloud).

## Key Features

- **Document CRUD** -- Insert, find, update, and delete documents with type-safe Ballerina records
- **Aggregation pipelines** -- Build complex data processing pipelines with MongoDB aggregation framework
- **Collection management** -- Create, list, and drop collections and databases
- **Connection string support** -- Connect using standard MongoDB connection strings
- **Authentication** -- Support for SCRAM-SHA-1 and SCRAM-SHA-256 authentication
- **SSL/TLS** -- Secure connections to MongoDB Atlas and self-hosted servers
- **Index management** -- Create and manage indexes for query optimization
- **Bulk operations** -- Batch insert with `insertMany()`

## Quick Start

```ballerina
import ballerinax/mongodb;
import ballerina/io;

configurable string connectionString = ?;

public function main() returns error? {
    mongodb:Client mongoClient = check new ({
        connection: connectionString
    });

    mongodb:Database moviesDb = check mongoClient->getDatabase("movies");
    mongodb:Collection moviesCollection = check moviesDb->getCollection("movies");

    // Insert a document
    check moviesCollection->insertOne({
        title: "Inception",
        year: 2010,
        genre: "Sci-Fi",
        rating: 8.8
    });

    // Find documents
    stream<record {}, error?> results = check moviesCollection->find({
        genre: "Sci-Fi"
    });

    check from var movie in results
        do {
            io:println(movie);
        };

    mongoClient->close();
}
```

```toml
# Config.toml
connectionString = "mongodb://localhost:27017"
```

## How It Works

The MongoDB connector uses a hierarchical client model:

1. **`mongodb:Client`** -- Top-level client that maintains the connection to MongoDB
2. **`mongodb:Database`** -- Represents a specific database on the server
3. **`mongodb:Collection`** -- Represents a collection within a database

Documents are represented as Ballerina `map<json>` or typed records. The connector automatically handles serialization and deserialization between Ballerina types and BSON documents.

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/mongodb/latest) -- Package page
