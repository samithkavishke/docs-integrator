---
title: "SAP - Examples"
description: "Code examples for the ballerinax/sap connector."
---

# SAP Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/sap;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    sap:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to SAP successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/sap;

configurable string token = ?;

final sap:Client sapClient = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "SAP" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to SAP");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/sap;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    sap:Client client = check new ({
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
