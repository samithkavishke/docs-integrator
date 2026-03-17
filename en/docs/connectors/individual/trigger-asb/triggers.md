---
title: "Azure Service Bus Trigger - Triggers"
description: "Available trigger events, service configuration, and payload types for the ballerinax/trigger.asb connector."
---

# Azure Service Bus Trigger - Available Events

The `ballerinax/trigger.asb` listener connects to Azure Service Bus via AMQP 1.0 and delivers messages from queues and topic subscriptions to your Ballerina service. The listener supports concurrent processing, peek-lock acknowledgment, and dead-letter handling.

## Listener initialization

Create the listener with a Service Bus connection string:

```ballerina
import ballerinax/trigger.asb as asb;

asb:ListenerConfig config = {
    connectionString: "<SERVICE_BUS_CONNECTION_STRING>"
};

listener asb:Listener asbListener = new (config);
```

### Configuration fields

| Field | Type | Description |
|---|---|---|
| `connectionString` | `string` | The Azure Service Bus Shared Access Signature (SAS) connection string |

Externalize via `Config.toml`:

```toml
# Config.toml
[config]
connectionString = "Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<KEY>"
```

## Service type: `MessageService`

The `asb:MessageService` defines two remote functions for handling messages and errors. Use the `@asb:ServiceConfig` annotation to specify which queue or topic subscription to listen to.

```ballerina
@asb:ServiceConfig {
    queueName: "my-queue",
    peekLockModeEnabled: true,
    maxConcurrency: 1,
    prefetchCount: 10,
    maxAutoLockRenewDuration: 300
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        // Process the incoming message
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        // Handle errors during message receipt
    }
}
```

### `@asb:ServiceConfig` annotation

| Field | Type | Default | Description |
|---|---|---|---|
| `queueName` | `string?` | `nil` | Name of the queue to listen to. Mutually exclusive with `topicName` |
| `topicName` | `string?` | `nil` | Name of the topic to listen to. Mutually exclusive with `queueName` |
| `subscriptionName` | `string?` | `nil` | Subscription name. Required when `topicName` is set |
| `peekLockModeEnabled` | `boolean` | `false` | `true` = PEEK_LOCK mode, `false` = RECEIVE_AND_DELETE mode |
| `maxConcurrency` | `int` | `1` | Number of messages processed in parallel |
| `prefetchCount` | `int` | `0` | Number of messages pre-fetched (0 = disabled) |
| `maxAutoLockRenewDuration` | `int` | `300` | Lock auto-renewal duration in seconds (PEEK_LOCK only) |
| `logLevel` | `string` | `"ERROR"` | SDK log level: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, `OFF` |

## Event: `onMessage`

Fires when a message is received from the configured queue or topic subscription. The remote function receives both the message payload and a `Caller` object for message disposition.

```ballerina
isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
    log:printInfo("Received message", body = message.toBalString());
    // Complete the message in peek-lock mode
    _ = check caller.complete(message);
}
```

### `asb:Message` record

Key fields in the message payload:

| Field | Type | Description |
|---|---|---|
| `body` | `anydata` | The message body content |
| `contentType` | `string?` | MIME content type of the message |
| `messageId` | `string?` | Unique message identifier |
| `to` | `string?` | Destination address |
| `replyTo` | `string?` | Reply-to address |
| `label` | `string?` | Application-specific label |
| `sessionId` | `string?` | Session identifier for session-aware processing |
| `correlationId` | `string?` | Correlation identifier for request-reply patterns |
| `timeToLive` | `int?` | Time-to-live in seconds |
| `sequenceNumber` | `int?` | Sequence number assigned by Service Bus |
| `lockToken` | `string?` | Lock token for peek-lock mode operations |
| `applicationProperties` | `map<anydata>?` | Custom application properties |

### `asb:Caller` operations

In PEEK_LOCK mode, use the `Caller` to control message disposition:

| Operation | Description |
|---|---|
| `caller.complete(message)` | Mark message as successfully processed and remove from queue |
| `caller.abandon(message)` | Release the lock and make the message available for redelivery |
| `caller.deadLetter(message)` | Move message to the dead-letter queue |
| `caller.defer(message)` | Defer message for later processing by sequence number |
| `caller.renewLock(message)` | Manually renew the message lock |

```ballerina
isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
    do {
        // Process message
        _ = check caller.complete(message);
    } on fail error e {
        log:printError("Processing failed, abandoning", 'error = e);
        _ = check caller.abandon(message);
    }
}
```

## Event: `onError`

Fires when an error occurs during message receipt or processing at the transport level. Use this to implement logging and alerting for infrastructure-level failures.

```ballerina
isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
    log:printError("Service Bus error occurred",
        'error = 'error,
        errorContext = context.toString());
}
```

## Listening to a topic subscription

To listen to a topic subscription instead of a queue, configure `topicName` and `subscriptionName`:

```ballerina
@asb:ServiceConfig {
    topicName: "order-events",
    subscriptionName: "fulfillment-sub",
    peekLockModeEnabled: true
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        log:printInfo("Topic message received", body = message.toBalString());
        _ = check caller.complete(message);
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Error on topic listener", 'error = 'error);
    }
}
```

## Multiple consumer services

You can attach multiple services to the same listener to consume from different queues or subscriptions simultaneously:

```ballerina
@asb:ServiceConfig { queueName: "orders-queue", peekLockModeEnabled: true }
service asb:MessageService "ordersService" on asbListener {
    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        _ = check caller.complete(message);
    }
    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? { return; }
}

@asb:ServiceConfig { queueName: "notifications-queue" }
service asb:MessageService "notificationsService" on asbListener {
    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        log:printInfo("Notification received");
    }
    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? { return; }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
