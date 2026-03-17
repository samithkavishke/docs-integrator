---
title: "Google People - Actions"
description: "Available actions and operations for the ballerinax/googleapis.people connector."
---

# Google People Actions

The `ballerinax/googleapis.people` package provides a client with operations to interact with Google People.

## Client Initialization

```ballerina
import ballerinax/googleapis.people;
import ballerina/log;

configurable string token = ?;

final people:Client peopleClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/googleapis.people/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check peopleClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check peopleClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check peopleClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check peopleClient->delete(id);
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
