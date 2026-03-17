---
title: "Weaviate - Examples"
description: "Code examples for the ballerinax/weaviate connector."
---

# Weaviate Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/weaviate;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    weaviate:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to Weaviate successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/weaviate;

configurable string token = ?;

final weaviate:Client weaviateClient = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "Weaviate" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to Weaviate");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/weaviate;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    weaviate:Client client = check new ({
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
