---
title: "Eventbrite - Actions"
description: "Available actions and operations for the ballerinax/eventbrite connector."
---

# Eventbrite Actions

The `ballerinax/eventbrite` package provides a client with operations to interact with Eventbrite.

## Client Initialization

```ballerina
import ballerinax/eventbrite;
import ballerina/log;

configurable string token = ?;

final eventbrite:Client eventbriteClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/eventbrite/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check eventbriteClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check eventbriteClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check eventbriteClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check eventbriteClient->delete(id);
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
