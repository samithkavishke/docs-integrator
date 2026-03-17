---
title: "Microsoft OneDrive - Actions"
description: "Available actions and operations for the ballerinax/microsoft.onedrive connector."
---

# Microsoft OneDrive Actions

The `ballerinax/microsoft.onedrive` package provides a client with operations to interact with Microsoft OneDrive.

## Client Initialization

```ballerina
import ballerinax/microsoft.onedrive;
import ballerina/log;

configurable string token = ?;

final onedrive:Client onedriveClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/microsoft.onedrive/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check onedriveClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check onedriveClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check onedriveClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check onedriveClient->delete(id);
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
