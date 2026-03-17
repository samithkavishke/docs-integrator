---
title: "SAP - Actions"
description: "Available actions and operations for the ballerinax/sap connector."
---

# SAP Actions

The `ballerinax/sap` package provides a client with operations to interact with SAP.

## Client Initialization

```ballerina
import ballerinax/sap;
import ballerina/log;

configurable string token = ?;

final sap:Client sapClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/sap/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check sapClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check sapClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check sapClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check sapClient->delete(id);
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
