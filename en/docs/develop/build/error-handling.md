---
sidebar_position: 8
title: Error Handling & Retry Patterns
description: Handle failures gracefully with try/catch, retry, circuit breaker, and fallback logic.
---

# Error Handling & Retry Patterns

Robust integrations handle failures gracefully. This page covers the practical implementation of error handling and resilience patterns when building integrations. For the full conceptual guide on error types, `check`, `do/on fail`, and custom errors, see [Error Handling (Design Logic)](/docs/develop/design-logic/error-handling).

## Quick Reference: Core Constructs

Ballerina treats errors as values. Functions that can fail return a union type including `error`.

```ballerina
// check propagates errors to the caller
function getUser(string id) returns User|error {
    User user = check dbClient->queryRow(`SELECT * FROM users WHERE id = ${id}`);
    return user;
}

// do/on fail catches errors in a scoped block
function safeGetUser(string id) returns User|error {
    do {
        return check getUser(id);
    } on fail error e {
        log:printError("Failed to get user", userId = id, 'error = e);
        return error("User lookup failed: " + e.message());
    }
}
```

## Retry Configuration

### Retry Blocks

Use `retry` blocks for transient failures that may succeed on a subsequent attempt.

```ballerina
function callExternalApi(string endpoint) returns json|error {
    retry<http:ClientError> (3) {
        json result = check httpClient->get(endpoint);
        return result;
    } on fail http:ClientError e {
        log:printError("All retries exhausted", 'error = e);
        return error("Service unavailable after retries");
    }
}
```

### HTTP Client Retry Configuration

Configure retries at the HTTP client level with exponential backoff.

```ballerina
final http:Client apiClient = check new ("https://api.example.com", {
    retryConfig: {
        count: 3,
        interval: 2,           // 2 seconds initial interval
        backOffFactor: 2.0,     // Exponential backoff multiplier
        maxWaitInterval: 30,    // Max 30 seconds between retries
        statusCodes: [500, 502, 503, 504]
    },
    timeout: 30
});
```

### Custom Retry Logic

Implement custom retry logic with backoff when the built-in retry does not fit your needs.

```ballerina
function callWithCustomRetry(string endpoint, int maxRetries) returns json|error {
    int attempt = 0;
    while attempt < maxRetries {
        do {
            return check httpClient->get(endpoint);
        } on fail error e {
            attempt += 1;
            if attempt >= maxRetries {
                return error("Max retries exceeded: " + e.message());
            }
            // Exponential backoff: 1s, 2s, 4s...
            decimal delay = <decimal>(2 ^ (attempt - 1));
            runtime:sleep(delay);
            log:printWarn("Retrying request", attempt = attempt, endpoint = endpoint);
        }
    }
    return error("Unreachable");
}
```

## Circuit Breaker Pattern

Prevent cascading failures by stopping requests to a service that is consistently failing.

```ballerina
final http:Client protectedClient = check new ("https://api.example.com", {
    circuitBreaker: {
        rollingWindow: {
            timeWindow: 60,
            bucketSize: 10
        },
        failureThreshold: 0.5,  // Open at 50% failure rate
        resetTime: 30,           // Half-open after 30 seconds
        statusCodes: [500, 502, 503]
    }
});
```

:::info Concept vs Implementation
For the conceptual overview and when to use circuit breakers, see [Integration Patterns: Circuit Breaker](/docs/tutorials/patterns/circuit-breaker). This page covers the implementation.
:::

### Using Circuit Breaker with Fallback

```ballerina
function getDataWithFallback() returns json|error {
    do {
        return check protectedClient->get("/api/data");
    } on fail error e {
        if e is http:CircuitBreakerError {
            log:printWarn("Circuit breaker open, using fallback");
            return getCachedData();
        }
        return e;
    }
}
```

## Fallback Logic

Provide alternative behavior when the primary path fails.

```ballerina
function fetchPrice(string productId) returns decimal|error {
    // Primary: live pricing service
    decimal|error livePrice = pricingClient->get("/prices/" + productId);
    if livePrice is decimal {
        check cacheClient->set(productId, livePrice.toString());
        return livePrice;
    }

    // Fallback: cached price
    string|error cached = cacheClient->get(productId);
    if cached is string {
        log:printWarn("Using cached price", productId = productId);
        return check decimal:fromString(cached);
    }

    return error("Price unavailable for " + productId);
}
```

## Error Responses in HTTP Services

Map errors to appropriate HTTP status codes.

```ballerina
resource function get orders/[string id]()
        returns Order|http:NotFound|http:InternalServerError {
    do {
        return check getOrder(id);
    } on fail error e {
        if e.message().includes("not found") {
            return <http:NotFound>{body: {message: "Order not found: " + id}};
        }
        log:printError("Unexpected error", 'error = e);
        return <http:InternalServerError>{body: {message: "Internal error"}};
    }
}
```

## Best Practices

1. **Use `check` for simple propagation** and `do/on fail` when recovery logic is needed.
2. **Configure retries at the client level** rather than wrapping calls in retry blocks when possible.
3. **Set appropriate timeouts** alongside retries to prevent resource exhaustion.
4. **Use circuit breakers** for calls to external services that may become unresponsive.
5. **Log errors with context** -- include identifiers, timestamps, and operation names.
6. **Combine retry and circuit breaker** -- retry handles transient failures; circuit breaker handles persistent ones.

## What's Next

- [Configuration Management](configuration-management.md) -- Configure retry and circuit breaker settings per environment
