---
title: "NATS - Actions"
description: "Available actions and operations for the ballerinax/nats connector."
---

# NATS Actions

The `ballerinax/nats` package provides a Client for publishing messages and a Listener for subscribing to subjects.

## Client operations

### Initialize the client

```ballerina
import ballerinax/nats;

nats:Client natsClient = check new (nats:DEFAULT_URL);
```

### Publish a message

```ballerina
string message = "Hello NATS";
check natsClient->publishMessage({
    content: message.toBytes(),
    subject: "demo.nats.basic"
});
```

### Publish with a reply-to subject

```ballerina
check natsClient->publish({
    content: "request data".toBytes(),
    subject: "demo.nats.basic",
    replyTo: "demo.reply"
});
```

### Request-reply

Send a message and wait for a response (synchronous):

```ballerina
nats:AnydataMessage|nats:Error reply = natsClient->requestMessage({
    content: "What is the status?".toBytes(),
    subject: "status.service"
}, 5);  // 5 second timeout
```

### Close the client

```ballerina
check natsClient->close();
```

## Listener (subscriber)

### Basic subscription

```ballerina
import ballerinax/nats;
import ballerina/log;

@nats:ServiceConfig {
    subject: "demo.example.*"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        log:printInfo("Received", subject = message.subject);
    }
}
```

### Subscription with request-reply

The `onRequest` method automatically replies to the sender:

```ballerina
@nats:ServiceConfig {
    subject: "time.service"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onRequest(nats:AnydataMessage message) returns string? {
        return "Current time: 2024-01-01T00:00:00Z";
    }
}
```

### Queue groups

Distribute messages across multiple subscribers for load balancing:

```ballerina
@nats:ServiceConfig {
    subject: "orders.>",
    queueGroup: "order-workers"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        log:printInfo("Worker processing", subject = message.subject);
    }
}
```

### Wildcard subscriptions

NATS supports two wildcard tokens:

- `*` matches a single token: `orders.*` matches `orders.new`, `orders.cancel`
- `>` matches one or more tokens: `orders.>` matches `orders.new`, `orders.us.new`

```ballerina
// Match all order events
@nats:ServiceConfig {
    subject: "orders.>"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        log:printInfo("Order event", subject = message.subject);
    }
}
```

## Error handling

```ballerina
do {
    check natsClient->publishMessage({
        content: "test".toBytes(),
        subject: "test.subject"
    });
} on fail nats:Error e {
    log:printError("NATS publish failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
