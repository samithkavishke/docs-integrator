---
title: "Weaviate - Actions"
description: "Available actions and operations for the ballerinax/weaviate connector."
---

# Weaviate Actions

The `ballerinax/weaviate` package provides a client with operations to interact with Weaviate.

## Client Initialization

```ballerina
import ballerinax/weaviate;
import ballerina/log;

configurable string token = ?;

final weaviate:Client weaviateClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/weaviate/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check weaviateClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check weaviateClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check weaviateClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check weaviateClient->delete(id);
    log:printInfo("Deleted successfully");
}
```

## Error Handling

```ballerina
do {
    // connector operation
} on fail error e {
    log:printError("Operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
