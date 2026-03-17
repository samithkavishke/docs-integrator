---
title: "SWIFT MT Messages - Examples"
description: "Code examples for the ballerinax/financial.swift.mt connector."
---

# SWIFT MT Messages Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/financial.swift.mt;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    mt:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to SWIFT MT Messages successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/financial.swift.mt;

configurable string token = ?;

final mt:Client mtClient = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "SWIFT MT Messages" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to SWIFT MT Messages");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/financial.swift.mt;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    mt:Client client = check new ({
        auth: { token: token }
    });
    
    do {
        // Perform operation
        log:printInfo("Operation completed");
    } on fail error e {
        log:printError("Operation failed", 'error = e);
        // Handle or propagate error
    }
}
```

## Configuration

```toml
# Config.toml
token = "<your-api-token>"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
