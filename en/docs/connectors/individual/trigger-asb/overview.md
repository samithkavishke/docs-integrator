---
title: "Azure Service Bus Trigger"
description: "Overview of the ballerinax/trigger.asb connector for WSO2 Integrator."
---

# Azure Service Bus Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.asb`](https://central.ballerina.io/ballerinax/trigger.asb/latest) |
| **Version** | 1.2.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.asb/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.asb/latest#functions) |

## Overview

The `ballerinax/trigger.asb` module provides a listener that receives messages from [Microsoft Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/) queues, topics, and subscriptions. Messages are delivered automatically as they arrive, eliminating the need for polling. The module uses the Azure Messaging Service Bus SDK 7.13.1 and communicates over the AMQP 1.0 protocol.

The listener supports two message receive modes:

- **PEEK_LOCK** -- Messages are locked for processing. You must explicitly complete, abandon, dead-letter, or defer the message using the `Caller` object.
- **RECEIVE_AND_DELETE** -- Messages are removed from the queue immediately upon receipt. No acknowledgment step is required.

### Supported events

| Remote function | Description |
|---|---|
| `onMessage` | A new message is received from the configured queue or topic subscription |
| `onError` | An error occurs while receiving or processing a message |

### Common use cases

- **Event-driven microservices** -- Decouple services using Service Bus queues for reliable asynchronous messaging between producer and consumer services.
- **Order processing pipelines** -- Receive order messages from a Service Bus queue, validate them, and forward to fulfillment systems.
- **Workload distribution** -- Use competing consumers on a single queue to distribute work across multiple service instances.
- **Dead-letter processing** -- Monitor the dead-letter queue for messages that failed processing and implement retry or alerting logic.
- **Topic-based pub/sub** -- Subscribe to specific topics to receive filtered messages based on subscription rules.
- **Cross-cloud integration** -- Bridge Azure Service Bus with other cloud services (AWS, GCP) by consuming messages and forwarding them to other platforms.

### Service configuration options

The `@asb:ServiceConfig` annotation controls listener behavior per service:

| Option | Type | Description |
|---|---|---|
| `queueName` | `string` | Queue to listen to (mutually exclusive with `topicName`) |
| `topicName` | `string` | Topic to listen to (mutually exclusive with `queueName`) |
| `subscriptionName` | `string` | Subscription name (required when using `topicName`) |
| `peekLockModeEnabled` | `boolean` | Enable peek-lock mode (default: `false` / receive-and-delete) |
| `maxConcurrency` | `int` | Number of messages processed in parallel (default: `1`) |
| `prefetchCount` | `int` | Number of messages pre-fetched (default: `0` / off) |
| `maxAutoLockRenewDuration` | `int` | Auto lock renewal duration in seconds (default: `300`) |
| `logLevel` | `string` | SDK log level: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, `OFF` |

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.asb"
version = "1.2.0"
```

```ballerina
import ballerina/log;
import ballerinax/trigger.asb as asb;

asb:ListenerConfig config = {
    connectionString: "<SERVICE_BUS_CONNECTION_STRING>"
};

listener asb:Listener asbListener = new (config);

@asb:ServiceConfig {
    queueName: "my-queue"
}
service asb:MessageService on asbListener {
    isolated remote function onMessage(asb:Message message, asb:Caller caller) returns error? {
        log:printInfo("Message received", body = message.toBalString());
        _ = check caller.complete(message);
    }

    isolated remote function onError(asb:ErrorContext context, error 'error) returns error? {
        log:printError("Error receiving message", 'error = 'error);
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.asb/latest)
