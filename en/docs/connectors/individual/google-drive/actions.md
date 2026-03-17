---
title: "Google Drive - Actions"
description: "Available actions and operations for the ballerinax/googleapis.drive connector."
---

# Google Drive Actions

The `ballerinax/googleapis.drive` package provides a client with operations to interact with Google Drive.

## Client Initialization

```ballerina
import ballerinax/googleapis.drive;
import ballerina/log;

configurable string token = ?;

final drive:Client driveClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/googleapis.drive/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check driveClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check driveClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check driveClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check driveClient->delete(id);
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
