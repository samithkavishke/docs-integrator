---
sidebar_position: 7
title: Control Flow
description: Conditional logic, loops, matching, and parallel execution.
---

# Control Flow

Control flow constructs determine the execution path of your integration logic. In WSO2 Integrator, these constructs are available both in the visual designer (as flow nodes) and in Ballerina pro-code.

## If/Else Statements

Use conditional branches to route logic based on runtime values.

```ballerina
function routeOrder(Order 'order) returns string|error {
    if 'order.total > 10000.00 {
        check sendToManualReview('order);
        return "MANUAL_REVIEW";
    } else if 'order.priority == "EXPRESS" {
        check processExpress('order);
        return "EXPRESS_PROCESSED";
    } else {
        check processStandard('order);
        return "STANDARD_PROCESSED";
    }
}
```

### Ternary-Style Conditional Expressions

For simple value selection, use conditional expressions.

```ballerina
string tier = customer.totalSpent > 10000 ? "gold" : "standard";
decimal discount = tier == "gold" ? 0.15 : 0.05;
```

## Match Expressions

Pattern matching provides a cleaner alternative to long if/else chains. Use `match` to compare a value against multiple patterns.

```ballerina
function handleEvent(json event) returns error? {
    string eventType = check event.type;

    match eventType {
        "ORDER_CREATED" => {
            check processNewOrder(event);
        }
        "ORDER_UPDATED" => {
            check processOrderUpdate(event);
        }
        "ORDER_CANCELLED" => {
            check processOrderCancellation(event);
        }
        "PAYMENT_RECEIVED" => {
            check processPayment(event);
        }
        _ => {
            log:printWarn("Unknown event type", eventType = eventType);
        }
    }
}
```

### Matching with Type Guards

Use type narrowing to handle union types.

```ballerina
function processResponse(json|xml|error response) returns string {
    if response is json {
        return response.toJsonString();
    } else if response is xml {
        return response.toString();
    } else {
        return "Error: " + response.message();
    }
}
```

## Foreach Loops

Iterate over arrays, maps, and other iterable collections.

```ballerina
function processOrders(Order[] orders) returns error? {
    foreach Order 'order in orders {
        check validateOrder('order);
        check submitOrder('order);
        log:printInfo("Order processed", orderId = 'order.id);
    }
}
```

### Iterating with Index

Use the `.enumerate()` method to access both the index and value.

```ballerina
function processWithIndex(string[] items) returns error? {
    foreach [int, string] [index, item] in items.enumerate() {
        log:printInfo("Processing item", index = index, item = item);
        check processItem(item);
    }
}
```

### Query Expressions

Ballerina query expressions provide a powerful way to filter, transform, and collect data from collections.

```ballerina
// Filter and transform in one expression
Order[] highValueOrders = from Order o in orders
    where o.total > 1000.00
    order by o.total descending
    select o;

// Transform records
string[] emails = from Customer c in customers
    where c.isActive
    select c.email;
```

## While Loops

Use `while` for conditional looping, such as polling or retry patterns.

```ballerina
function pollUntilComplete(string jobId) returns JobResult|error {
    int attempts = 0;
    int maxAttempts = 60;

    while attempts < maxAttempts {
        JobResult result = check getJobStatus(jobId);
        if result.status == "COMPLETED" {
            return result;
        }
        if result.status == "FAILED" {
            return error("Job failed: " + result.message);
        }
        runtime:sleep(5);
        attempts += 1;
    }
    return error("Job timed out after " + maxAttempts.toString() + " attempts");
}
```

## Parallel Execution with Workers

Named workers run concurrently within a function. Use them to perform independent operations in parallel.

```ballerina
function enrichOrder(Order 'order) returns EnrichedOrder|error {
    // Workers execute concurrently
    worker customerWorker returns Customer|error {
        return getCustomerDetails('order.customerId);
    }

    worker inventoryWorker returns InventoryStatus|error {
        return checkInventory('order.items);
    }

    worker pricingWorker returns PricingResult|error {
        return calculatePricing('order.items, 'order.customerId);
    }

    // Wait for all workers to complete
    Customer customer = check wait customerWorker;
    InventoryStatus inventory = check wait inventoryWorker;
    PricingResult pricing = check wait pricingWorker;

    return {
        'order: 'order,
        customer: customer,
        inventory: inventory,
        pricing: pricing
    };
}
```

### Worker Message Passing

Workers can send and receive messages for coordination.

```ballerina
function pipeline() returns error? {
    worker fetch returns error? {
        json data = check httpClient->get("/api/data");
        data -> transform;
    }

    worker transform returns error? {
        json data = check <- fetch;
        json transformed = check transformData(data);
        transformed -> store;
    }

    worker store returns error? {
        json data = check <- transform;
        check dbClient->execute(`INSERT INTO results VALUES (${data.toJsonString()})`);
    }

    check wait fetch;
    check wait transform;
    check wait store;
}
```

## Combining Constructs

Integration logic often combines multiple control flow constructs.

```ballerina
function processOrderBatch(Order[] orders) returns BatchResult|error {
    int succeeded = 0;
    int failed = 0;

    foreach Order 'order in orders {
        do {
            match 'order.type {
                "STANDARD" => {
                    check processStandard('order);
                }
                "EXPRESS" => {
                    check processExpress('order);
                }
                _ => {
                    log:printWarn("Unknown order type", orderType = 'order.type);
                    failed += 1;
                    continue;
                }
            }
            succeeded += 1;
        } on fail error e {
            log:printError("Order failed", orderId = 'order.id, 'error = e);
            failed += 1;
        }
    }

    return {succeeded, failed, total: orders.length()};
}
```

## What's Next

- [Error Handling](error-handling.md) -- Handle failures in your control flow
