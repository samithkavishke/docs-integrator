---
title: "Azure Service Bus Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.asb connector."
---

# Azure Service Bus Trigger Examples

## Example 1: Receive messages from a queue with peek-lock

This example listens to a Service Bus queue in peek-lock mode, processes messages, and completes them upon success or abandons them on failure.

```ballerina
import ballerina/log;
import ballerinax/trigger.asb as asb;

configurable string connectionString = ?;

asb:ListenerConfig config = {
    connectionString: connectionString
};

listener asb:Listener asbListener = new (config);

@asb:ServiceConfig {
    queueName: "order-queue",
    peekLockModeEnabled: true,
    maxConcurrency: 1,
    prefetchCount: 10,
    maxAutoLockRenewDuration: 300
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        do {
            log:printInfo("Order message received",
                messageId = message?.messageId.toString(),
                body = message.toBalString());
            // Process the order
            _ = check caller.complete(message);
            log:printInfo("Message completed successfully");
        } on fail error e {
            log:printError("Failed to process order, abandoning message",
                'error = e);
            _ = check caller.abandon(message);
        }
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Service Bus error",
            'error = 'error,
            context = context.toString());
    }
}
```

**Config.toml:**

```toml
connectionString = "Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<YOUR_KEY>"
```

## Example 2: Listen to a topic subscription

This example subscribes to a Service Bus topic and processes messages from a specific subscription. This is useful for pub/sub patterns where multiple consumers need different views of the same message stream.

```ballerina
import ballerina/log;
import ballerinax/trigger.asb as asb;

configurable string connectionString = ?;

asb:ListenerConfig config = {
    connectionString: connectionString
};

listener asb:Listener asbListener = new (config);

@asb:ServiceConfig {
    topicName: "order-events",
    subscriptionName: "fulfillment-processor",
    peekLockModeEnabled: true,
    maxConcurrency: 5,
    prefetchCount: 20
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        do {
            log:printInfo("Topic message received",
                messageId = message?.messageId.toString(),
                label = message?.label.toString(),
                body = message.toBalString());

            // Process the message based on the label
            string label = (message?.label ?: "unknown").toString();
            if label == "high-priority" {
                log:printInfo("Processing high-priority order");
            }

            _ = check caller.complete(message);
        } on fail error e {
            log:printError("Processing failed", 'error = e);
            _ = check caller.abandon(message);
        }
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Topic subscription error", 'error = 'error);
    }
}
```

## Example 3: Dead-letter handling and message forwarding

This example demonstrates routing failed messages to the dead-letter queue and forwarding successfully processed messages to a downstream REST API.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.asb as asb;

configurable string connectionString = ?;
configurable string downstreamUrl = ?;

asb:ListenerConfig config = {
    connectionString: connectionString
};

listener asb:Listener asbListener = new (config);

final http:Client apiClient = check new (downstreamUrl);

@asb:ServiceConfig {
    queueName: "incoming-orders",
    peekLockModeEnabled: true,
    maxConcurrency: 3,
    prefetchCount: 10,
    maxAutoLockRenewDuration: 600
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        do {
            // Forward to downstream API
            json payload = {
                messageId: message?.messageId,
                body: message.toBalString(),
                label: message?.label
            };
            http:Response resp = check apiClient->post("/messages", payload);

            if resp.statusCode == 200 {
                _ = check caller.complete(message);
                log:printInfo("Message processed and completed",
                    messageId = message?.messageId.toString());
            } else {
                log:printWarn("Downstream returned non-200, dead-lettering",
                    statusCode = resp.statusCode);
                _ = check caller.deadLetter(message);
            }
        } on fail error e {
            log:printError("Processing failed, sending to dead-letter queue",
                'error = e,
                messageId = message?.messageId.toString());
            _ = check caller.deadLetter(message);
        }
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Listener error occurred", 'error = 'error);
    }
}
```

**Config.toml:**

```toml
connectionString = "Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<YOUR_KEY>"
downstreamUrl = "https://api.example.com"
```

## Example 4: Receive-and-delete mode for fire-and-forget

For scenarios where message acknowledgment is not needed (e.g., logging or analytics ingestion), use receive-and-delete mode for maximum throughput.

```ballerina
import ballerina/log;
import ballerinax/trigger.asb as asb;

configurable string connectionString = ?;

asb:ListenerConfig config = {
    connectionString: connectionString
};

listener asb:Listener asbListener = new (config);

@asb:ServiceConfig {
    queueName: "telemetry-queue",
    peekLockModeEnabled: false,
    maxConcurrency: 10,
    prefetchCount: 50
}
service asb:MessageService on asbListener {

    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        // No need to call caller.complete() in receive-and-delete mode
        log:printInfo("Telemetry data received",
            messageId = message?.messageId.toString(),
            body = message.toBalString());
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Telemetry listener error", 'error = 'error);
    }
}
```

## Running the examples

1. Create an Azure Service Bus namespace and queue or topic as described in the [Setup Guide](setup).
2. Obtain the connection string from the Azure portal under **Shared access policies**.
3. Update `Config.toml` with your connection string.
4. Compile and run:

   ```bash
   bal run
   ```

5. Send a test message using the Azure portal, Azure CLI, or the `ballerinax/asb` sender client.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
