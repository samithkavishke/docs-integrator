---
title: "Azure AI Search - Actions"
description: "Available actions and operations for the ballerinax/azure.ai.search connector."
---

# Azure AI Search Actions

The `ballerinax/azure.ai.search` package provides a client for interacting with the Azure AI Search REST API, including index management, document operations, and search queries.

## Client Initialization

```ballerina
import ballerinax/azure.ai.search as azureSearch;

configurable string serviceUrl = ?;
configurable string adminKey = ?;

final azureSearch:Client searchClient = check new (serviceUrl, {});
```

## Index Management

### indexesCreate()

Create a new search index with a defined schema.

```ballerina
azureSearch:SearchIndex searchIndex = {
    name: "hotels",
    fields: [
        {
            name: "id",
            'type: "Edm.String",
            'key: true,
            searchable: false
        },
        {
            name: "name",
            'type: "Edm.String",
            searchable: true,
            filterable: true
        },
        {
            name: "description",
            'type: "Edm.String",
            searchable: true
        },
        {
            name: "rating",
            'type: "Edm.Double",
            filterable: true,
            sortable: true
        }
    ]
};

azureSearch:SearchIndex response = check searchClient->indexesCreate(
    searchIndex, {"api-key": adminKey}, {api\-version: "2024-07-01"}
);
```

### Field Types

| Type | Description |
|------|-------------|
| `Edm.String` | Text fields for search and display |
| `Edm.Int32` | Integer values |
| `Edm.Double` | Floating-point numbers |
| `Edm.Boolean` | True/false values |
| `Edm.DateTimeOffset` | Date and time values |
| `Collection(Edm.Single)` | Vector field for similarity search |

### Field Attributes

| Attribute | Description |
|-----------|-------------|
| `key` | Marks the field as the document key (one per index) |
| `searchable` | Enables full-text search on the field |
| `filterable` | Enables filtering on the field |
| `sortable` | Enables sorting by the field |
| `facetable` | Enables faceted navigation |

## Document Operations

### documentsIndex()

Upload, merge, or delete documents in an index.

```ballerina
json documentBatch = {
    "value": [
        {
            "@@search.action": "upload",
            "id": "1",
            "name": "Grand Hotel",
            "description": "Luxury hotel in the city center",
            "rating": 4.8
        },
        {
            "@@search.action": "upload",
            "id": "2",
            "name": "Budget Inn",
            "description": "Affordable accommodation near the airport",
            "rating": 3.5
        }
    ]
};
```

### Document Actions

| Action | Description |
|--------|-------------|
| `upload` | Insert or replace the document |
| `merge` | Update specific fields in an existing document |
| `mergeOrUpload` | Merge if exists, otherwise upload |
| `delete` | Remove the document from the index |

## Search Operations

### documentsSearchPost()

Execute search queries against an index.

```ballerina
json searchRequest = {
    "search": "luxury hotel",
    "filter": "rating ge 4.0",
    "orderby": "rating desc",
    "top": 10,
    "select": "id,name,description,rating"
};
```

### Search Parameters

| Parameter | Description |
|-----------|-------------|
| `search` | Full-text search query string |
| `filter` | OData filter expression for structured filtering |
| `orderby` | Sort order for results |
| `top` | Maximum number of results to return |
| `select` | Comma-separated list of fields to include in results |
| `searchMode` | `any` (default) or `all` for matching logic |

## Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.ai.search as azureSearch;

configurable string serviceUrl = ?;
configurable string adminKey = ?;

public function main() returns error? {
    do {
        azureSearch:Client searchClient = check new (serviceUrl, {});

        azureSearch:SearchIndex index = {
            name: "test-index",
            fields: [
                {name: "id", 'type: "Edm.String", 'key: true, searchable: false}
            ]
        };

        azureSearch:SearchIndex result = check searchClient->indexesCreate(
            index, {"api-key": adminKey}, {api\-version: "2024-07-01"}
        );
        io:println("Index created: ", result.name);
    } on fail error e {
        log:printError("Azure AI Search operation failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
