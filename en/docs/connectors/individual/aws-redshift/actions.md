---
title: "Amazon Redshift - Actions"
description: "Available actions and operations for the ballerinax/aws.redshift connector."
---

# Amazon Redshift Actions

The `ballerinax/aws.redshift` package provides a client with operations to interact with Amazon Redshift.

## Client Initialization

```ballerina
import ballerinax/aws.redshift;
import ballerina/log;

configurable string token = ?;

final redshift:Client redshiftClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/aws.redshift/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check redshiftClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check redshiftClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check redshiftClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check redshiftClient->delete(id);
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
