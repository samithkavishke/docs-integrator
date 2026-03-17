---
title: "Azure Cosmos DB - Actions"
description: "Available actions and operations for the ballerinax/azure_cosmosdb connector."
---

# Azure Cosmos DB Actions

The `ballerinax/azure_cosmosdb` package provides `DataPlaneClient` for document operations and `ManagementClient` for database/container management.

## Client Initialization

```ballerina
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

cosmosdb:ConnectionConfig config = {
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
};

cosmosdb:DataPlaneClient cosmosClient = check new (config);
cosmosdb:ManagementClient mgmtClient = check new (config);
```

## Database Operations

### Create Database

```ballerina
cosmosdb:Database db = check mgmtClient->createDatabase("integration-db");
io:println("Database created: ", db.id);
```

### List Databases

```ballerina
cosmosdb:DatabaseList databases = check mgmtClient->listDatabases();
foreach cosmosdb:Database db in databases.databases {
    io:println("Database: ", db.id);
}
```

### Delete Database

```ballerina
check mgmtClient->deleteDatabase("old-database");
```

## Container Operations

### Create Container

```ballerina
cosmosdb:ContainerProperties containerProps = {
    id: "products",
    partitionKey: {paths: ["/category"], kind: "Hash"}
};

cosmosdb:Container container = check mgmtClient->createContainer(
    "integration-db", containerProps);
io:println("Container created: ", container.id);
```

### List Containers

```ballerina
cosmosdb:ContainerList containers = check mgmtClient->listContainers("integration-db");
foreach cosmosdb:Container c in containers.containers {
    io:println("Container: ", c.id);
}
```

### Delete Container

```ballerina
check mgmtClient->deleteContainer("integration-db", "old-container");
```

## Document Operations

### Create Document

```ballerina
json productDoc = {
    "id": "prod-001",
    "category": "electronics",
    "name": "Wireless Mouse",
    "price": 29.99,
    "inStock": true,
    "tags": ["wireless", "mouse", "peripheral"]
};

cosmosdb:Document created = check cosmosClient->createDocument(
    "integration-db", "products", productDoc, "electronics"
);
io:println("Document created: ", created.id);
```

### Get Document

```ballerina
cosmosdb:Document doc = check cosmosClient->getDocument(
    "integration-db", "products", "prod-001", "electronics"
);
io:println("Document: ", doc);
```

### Replace Document

```ballerina
json updatedDoc = {
    "id": "prod-001",
    "category": "electronics",
    "name": "Wireless Mouse Pro",
    "price": 39.99,
    "inStock": true,
    "tags": ["wireless", "mouse", "pro", "peripheral"]
};

cosmosdb:Document replaced = check cosmosClient->replaceDocument(
    "integration-db", "products", "prod-001", updatedDoc, "electronics"
);
```

### Delete Document

```ballerina
check cosmosClient->deleteDocument(
    "integration-db", "products", "prod-001", "electronics"
);
```

### List Documents

```ballerina
cosmosdb:DocumentList docs = check cosmosClient->listDocuments(
    "integration-db", "products"
);
foreach cosmosdb:Document d in docs.documents {
    io:println("Doc ID: ", d.id);
}
```

## Query Operations

### Execute SQL Query

Run SQL queries against a container.

```ballerina
cosmosdb:ResourceQueryOptions queryOptions = {
    query: "SELECT * FROM products p WHERE p.price > @minPrice AND p.category = @category",
    parameters: [
        {name: "@minPrice", value: "25.00"},
        {name: "@category", value: "electronics"}
    ]
};

cosmosdb:QueryResult result = check cosmosClient->queryDocuments(
    "integration-db", "products", queryOptions
);

foreach json doc in result.documents {
    io:println("Found: ", check doc.name, " - $", check doc.price);
}
```

**Query with aggregation:**

```ballerina
cosmosdb:ResourceQueryOptions aggQuery = {
    query: "SELECT VALUE COUNT(1) FROM products p WHERE p.inStock = true"
};

cosmosdb:QueryResult countResult = check cosmosClient->queryDocuments(
    "integration-db", "products", aggQuery
);
```

**Query with sorting and limit:**

```ballerina
cosmosdb:ResourceQueryOptions sortedQuery = {
    query: "SELECT TOP 10 * FROM products p ORDER BY p.price DESC"
};

cosmosdb:QueryResult topProducts = check cosmosClient->queryDocuments(
    "integration-db", "products", sortedQuery
);
```

## Stored Procedures

### Execute Stored Procedure

```ballerina
json spResult = check cosmosClient->executeStoredProcedure(
    "integration-db", "products", "calculateTotal",
    "electronics", ["prod-001", "prod-002"]
);
io:println("Stored procedure result: ", spResult);
```

## Error Handling

```ballerina
import ballerina/log;

do {
    cosmosdb:Document doc = check cosmosClient->getDocument(
        "integration-db", "products", "nonexistent", "electronics"
    );
} on fail error e {
    log:printError("Cosmos DB operation failed", 'error = e);
}
```

### Common Error Scenarios

| Error | HTTP Code | Resolution |
|---|---|---|
| Unauthorized | 401 | Verify primary key or resource token |
| Not Found | 404 | Check database, container, or document ID |
| Conflict | 409 | Document with same ID exists; use replace |
| Too Many Requests | 429 | Exceeded RU limit; retry with backoff |
| Entity Too Large | 413 | Document exceeds 2 MB limit |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
