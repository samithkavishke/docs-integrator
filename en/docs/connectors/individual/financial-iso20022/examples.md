---
title: "ISO 20022 - Examples"
description: "Code examples for the ballerinax/financial.iso20022 connector."
---

# ISO 20022 Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/financial.iso20022;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    iso20022:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to ISO 20022 successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/financial.iso20022;

configurable string token = ?;

final iso20022:Client iso20022Client = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "ISO 20022" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to ISO 20022");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/financial.iso20022;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    iso20022:Client client = check new ({
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
