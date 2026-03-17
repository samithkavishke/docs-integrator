---
title: "SCIM - Actions"
description: "Available actions and operations for the ballerinax/scim connector."
---

# SCIM Actions

The `ballerinax/scim` package provides a client with operations to interact with SCIM.

## Client Initialization

```ballerina
import ballerinax/scim;
import ballerina/log;

configurable string token = ?;

final scim:Client scimClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/scim/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check scimClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check scimClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check scimClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check scimClient->delete(id);
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
