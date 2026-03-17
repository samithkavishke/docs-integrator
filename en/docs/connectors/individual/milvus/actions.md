---
title: "Milvus Vector Database - Actions"
description: "Available actions and operations for the ballerinax/milvus connector."
---

# Milvus Vector Database Actions

The `ballerinax/milvus` package provides a client with operations to interact with Milvus Vector Database.

## Client Initialization

```ballerina
import ballerinax/milvus;
import ballerina/log;

configurable string token = ?;

final milvus:Client milvusClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/milvus/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check milvusClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check milvusClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check milvusClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check milvusClient->delete(id);
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
