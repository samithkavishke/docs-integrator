---
title: "Microsoft Excel - Actions"
description: "Available actions and operations for the ballerinax/microsoft.excel connector."
---

# Microsoft Excel Actions

The `ballerinax/microsoft.excel` package provides a client with operations to interact with Microsoft Excel.

## Client Initialization

```ballerina
import ballerinax/microsoft.excel;
import ballerina/log;

configurable string token = ?;

final excel:Client excelClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/microsoft.excel/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check excelClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check excelClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check excelClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check excelClient->delete(id);
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
