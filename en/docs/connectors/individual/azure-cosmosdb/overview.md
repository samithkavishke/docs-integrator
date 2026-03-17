---
title: "Azure Cosmos DB"
description: "Overview of the ballerinax/azure_cosmosdb connector for WSO2 Integrator."
---

# Azure Cosmos DB

| | |
|---|---|
| **Package** | [`ballerinax/azure_cosmosdb`](https://central.ballerina.io/ballerinax/azure_cosmosdb/latest) |
| **Version** | 4.2.0 |
| **Category** | Cloud Services - Database |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure_cosmosdb/4.2.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure_cosmosdb/4.2.0#functions) |

## Overview

The `ballerinax/azure_cosmosdb` connector provides programmatic access to Azure Cosmos DB SQL API from WSO2 Integrator. Azure Cosmos DB is a globally distributed, multi-model database service offering low-latency, scalable access to data. This connector supports database and container management, document CRUD operations, and SQL-like queries.

## Key Capabilities

- **Database Management** -- Create, list, and delete Cosmos DB databases
- **Container Management** -- Create, list, and delete containers with partition key configuration
- **Document CRUD** -- Create, read, replace, and delete JSON documents
- **SQL Queries** -- Execute SQL queries against containers with parameterized support
- **Partition Key Support** -- Full support for partition key-based operations
- **Stored Procedures** -- Execute server-side stored procedures

## Use Cases

| Scenario | Description |
|---|---|
| Product Catalog | Store product data with flexible schema and global distribution |
| User Profiles | Manage user profiles with low-latency read/write access |
| IoT Telemetry | Store high-volume device telemetry data |
| Content Management | Document-based content storage with rich querying |
| Shopping Cart | Session-aware shopping cart with partition-based isolation |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure_cosmosdb"
version = "4.2.0"
```

```ballerina
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

cosmosdb:ConnectionConfig cosmosConfig = {
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
};

cosmosdb:DataPlaneClient cosmosClient = check new (cosmosConfig);
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Azure Cosmos DB SQL API | Latest |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure_cosmosdb/4.2.0)
- [Azure Cosmos DB Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/)
