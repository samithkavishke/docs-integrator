---
title: "PayPal Orders - Examples"
description: "Code examples for the ballerinax/paypal.orders connector."
---

# PayPal Orders Examples

## Basic Usage

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/paypal.orders;

configurable string token = ?;

public function main() returns error? {
    // Initialize client
    orders:Client client = check new ({
        auth: { token: token }
    });
    
    io:println("Connected to PayPal Orders successfully");
}
```

## Integration as HTTP Service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/paypal.orders;

configurable string token = ?;

final orders:Client ordersClient = check new ({
    auth: { token: token }
});

service /api on new http:Listener(9090) {

    resource function get data() returns json|error {
        // Use the connector to fetch data
        // Return as JSON response
        return { "status": "ok", "source": "PayPal Orders" };
    }

    resource function post data(json payload) returns http:Created|error {
        // Use the connector to send data
        log:printInfo("Sending data to PayPal Orders");
        return http:CREATED;
    }
}
```

## Error Handling Pattern

```ballerina
import ballerinax/paypal.orders;
import ballerina/log;

configurable string token = ?;

public function main() returns error? {
    orders:Client client = check new ({
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
