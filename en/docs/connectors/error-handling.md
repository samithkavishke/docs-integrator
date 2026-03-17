---
title: Error Handling per Connector
description: Handle connection errors, authentication failures, rate limits, timeouts, and retries.
---

# Error Handling per Connector

Handle errors specific to connector operations — connection failures, authentication errors, rate limits, and timeouts. Ballerina's type system makes it impossible to silently ignore connector errors.

## Connection Errors vs Operation Errors

| Error Type | When It Occurs | Example |
|-----------|---------------|---------|
| **Connection error** | Client initialization fails | Wrong host, network unreachable, SSL handshake failure |
| **Authentication error** | Credentials are invalid or expired | Invalid API key, expired OAuth token |
| **Operation error** | A specific operation fails | SQL syntax error, record not found, permission denied |
| **Timeout error** | Operation exceeds time limit | Slow database query, unresponsive API |
| **Rate limit error** | Too many requests | HTTP 429, API quota exceeded |

## Handling Connection Initialization Errors

```ballerina
import ballerinax/mysql;

// Connection errors occur at initialization
mysql:Client|error db = new (
    host = "db.example.com", user = "app", password = "pass",
    database = "mydb"
);

if db is error {
    // Cannot proceed without a database connection
    panic error("Database connection failed: " + db.message());
}
```

## Handling Operation Errors

```ballerina
import ballerina/http;
import ballerina/log;

function callExternalApi(string endpoint) returns json|error {
    do {
        json result = check apiClient->get(endpoint);
        return result;
    } on fail http:ClientError e {
        if e is http:IdleTimeoutError {
            log:printWarn("Request timed out, retrying once...");
            return check apiClient->get(endpoint);
        }
        if e is http:ApplicationResponseError {
            int statusCode = e.detail().statusCode;
            if statusCode == 429 {
                log:printWarn("Rate limited. Retry after backoff.");
                return error("Rate limited by external API");
            }
            if statusCode >= 500 {
                log:printError("Server error from external API", 'error = e);
                return error("External service unavailable");
            }
        }
        return error("API call failed: " + e.message());
    }
}
```

## Retry Configuration

### HTTP Client Retry

```ballerina
final http:Client resilientClient = check new ("https://api.example.com", {
    retryConfig: {
        count: 3,                     // Max retries
        interval: 2,                  // Initial wait (seconds)
        backOffFactor: 2.0,           // Exponential backoff multiplier
        maxWaitInterval: 30,          // Max wait between retries (seconds)
        statusCodes: [500, 502, 503, 504]  // Retry on these status codes
    }
});
```

### Database Retry

```ballerina
function insertWithRetry(Customer customer) returns string|error {
    retry<error>(3) {
        sql:ExecutionResult result = check db->execute(
            `INSERT INTO customers (name, email) VALUES (${customer.name}, ${customer.email})`
        );
        return result.lastInsertId.toString();
    } on fail error e {
        log:printError("Insert failed after 3 retries", 'error = e);
        return error("Failed to insert customer: " + e.message());
    }
}
```

## Timeout Configuration

```ballerina
// HTTP timeouts
final http:Client api = check new ("https://api.example.com", {
    timeout: 30  // 30-second response timeout
});

// Database timeouts
final mysql:Client db = check new (
    host = "localhost", user = "root", password = "pass",
    database = "mydb",
    options = {
        connectTimeout: 10,    // 10-second connection timeout
        socketTimeout: 60      // 60-second socket timeout
    }
);
```

## Circuit Breaker Pattern

Prevent cascading failures when an external service is down:

```ballerina
final http:Client protectedClient = check new ("https://api.example.com", {
    circuitBreaker: {
        rollingWindow: {
            timeWindow: 60,     // 60-second evaluation window
            bucketSize: 10      // 10-second buckets
        },
        failureThreshold: 0.5, // Open circuit at 50% failure rate
        resetTime: 30,         // Try again after 30 seconds
        statusCodes: [500, 502, 503]
    }
});

function callProtectedService() returns json|error {
    do {
        return check protectedClient->get("/api/data");
    } on fail error e {
        log:printWarn("Circuit breaker engaged, using fallback");
        return getCachedData();
    }
}
```

## Connector-Specific Error Types

### Database Errors

```ballerina
import ballerina/sql;

function queryCustomer(int id) returns Customer|error {
    do {
        return check db->queryRow(`SELECT * FROM customers WHERE id = ${id}`);
    } on fail sql:NoRowsError e {
        return error("Customer not found: " + id.toString());
    } on fail sql:Error e {
        log:printError("Database error", 'error = e);
        return error("Database operation failed");
    }
}
```

### HTTP Errors

```ballerina
import ballerina/http;

function callApi() returns json|error {
    do {
        return check apiClient->get("/data");
    } on fail http:ClientAuthError e {
        // Token expired — refresh and retry
        return error("Authentication failed: " + e.message());
    } on fail http:IdleTimeoutError e {
        return error("Request timed out");
    } on fail http:ApplicationResponseError e {
        int status = e.detail().statusCode;
        return error("HTTP " + status.toString() + ": " + e.message());
    }
}
```

## Best Practices

1. **Always handle errors explicitly** — use `check` for propagation or `do/on fail` for recovery.
2. **Configure retries at the client level** — the connector handles backoff automatically.
3. **Use circuit breakers** for external service calls to prevent cascading failures.
4. **Log errors with context** — include the operation, connector name, and relevant IDs.
5. **Set appropriate timeouts** — long timeouts waste resources; short ones cause false failures.
6. **Provide fallback behavior** — cached data, default values, or graceful degradation.

## What's Next

- [Connection Configuration](configuration.md) — Configure robust connections
- [Authentication Methods](authentication.md) — Handle credential expiration
- [Error Handling Patterns](/docs/develop/design-logic/error-handling) — General error handling guide
