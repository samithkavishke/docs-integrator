---
title: "Vonage SMS - Actions"
description: "Available actions and operations for the ballerinax/vonage.sms connector."
---

# Vonage SMS Actions

The `ballerinax/vonage.sms` package provides a client with operations to interact with Vonage SMS.

## Client Initialization

```ballerina
import ballerinax/vonage.sms;
import ballerina/log;

configurable string token = ?;

final sms:Client smsClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/vonage.sms/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check smsClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check smsClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check smsClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check smsClient->delete(id);
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
