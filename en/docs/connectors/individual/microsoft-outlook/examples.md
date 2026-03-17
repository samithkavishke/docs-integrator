---
title: "Microsoft Outlook Mail - Examples"
description: "Code examples for the ballerinax/microsoft.outlook.mail connector."
---

# Microsoft Outlook Mail Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/microsoft.outlook.mail;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    mail:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to Microsoft Outlook Mail successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/microsoft.outlook.mail;

configurable string token = ?;

final mail:Client mailClient = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "Microsoft Outlook Mail" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to Microsoft Outlook Mail");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/microsoft.outlook.mail;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    mail:Client client = check new ({
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
