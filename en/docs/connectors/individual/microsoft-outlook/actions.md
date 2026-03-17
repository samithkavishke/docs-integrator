---
title: "Microsoft Outlook Mail - Actions"
description: "Available actions and operations for the ballerinax/microsoft.outlook.mail connector."
---

# Microsoft Outlook Mail Actions

The `ballerinax/microsoft.outlook.mail` package provides a client with operations to interact with Microsoft Outlook Mail.

## Client Initialization

```ballerina
import ballerinax/microsoft.outlook.mail;
import ballerina/log;

configurable string token = ?;

final mail:Client mailClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/microsoft.outlook.mail/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check mailClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check mailClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check mailClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check mailClient->delete(id);
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
