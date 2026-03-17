---
title: "DocuSign - Actions"
description: "Available actions and operations for the ballerinax/docusign.dsadmin connector."
---

# DocuSign Actions

The `ballerinax/docusign.dsadmin` package provides a client with operations to interact with DocuSign.

## Client Initialization

```ballerina
import ballerinax/docusign.dsadmin;
import ballerina/log;

configurable string token = ?;

final dsadmin:Client dsadminClient = check new ({
    auth: {
        token: token
    }
});
```

## Common Operations

For the complete list of operations and their parameters, see the [API documentation](https://central.ballerina.io/ballerinax/docusign.dsadmin/latest#clients).

### Create

```ballerina
public function createRecord() returns error? {
    var result = check dsadminClient->create({
        // Record fields
    });
    log:printInfo("Created successfully", id = result.id);
}
```

### Read

```ballerina
public function getRecord(string id) returns error? {
    var result = check dsadminClient->get(id);
    log:printInfo("Retrieved record", data = result);
}
```

### Update

```ballerina
public function updateRecord(string id) returns error? {
    var result = check dsadminClient->update(id, {
        // Updated fields
    });
    log:printInfo("Updated successfully");
}
```

### Delete

```ballerina
public function deleteRecord(string id) returns error? {
    check dsadminClient->delete(id);
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
