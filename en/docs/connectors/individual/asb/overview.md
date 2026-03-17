---
title: "Azure Service Bus"
description: "Overview of the ballerinax/asb connector for WSO2 Integrator."
---

# Azure Service Bus

| | |
|---|---|
| **Package** | [`ballerinax/asb`](https://central.ballerina.io/ballerinax/asb/latest) |
| **Version** | 3.9.1 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/asb/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/asb/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-azure-service-bus) |

## Overview

The `ballerinax/asb` package provides the capability to connect to Microsoft Azure Service Bus, a fully managed enterprise message broker with message queues and publish-subscribe topics. Azure Service Bus handles messages containing data encoded in formats such as JSON, XML, and plain text.

This connector utilizes the Azure Service Bus Java SDK 7.13.1.

### Key capabilities

- **Admin client**: Manage (get, create, update, delete, list) queues, topics, subscriptions, and rules
- **Message sender**: Send messages to queues, topics, or subscriptions with scheduling and batching
- **Message receiver**: Receive messages from queues, topics, or subscriptions with peek-lock or receive-and-delete modes
- **Sessions**: Session-aware messaging for ordered processing within session groups
- **Dead-letter queue**: Access dead-lettered messages for inspection and reprocessing

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "asb"
version = "3.9.1"
```

### Send a message

```ballerina
import ballerinax/asb;
import ballerina/log;

configurable string connectionString = ?;

public function main() returns error? {
    asb:MessageSender sender = check new (connectionString, "my-queue");

    check sender->send({
        body: "Hello Azure Service Bus",
        contentType: "text/plain"
    });

    log:printInfo("Message sent to queue");
    check sender->close();
}
```

### Receive messages

```ballerina
import ballerinax/asb;
import ballerina/log;

configurable string connectionString = ?;

public function main() returns error? {
    asb:MessageReceiver receiver = check new (connectionString, "my-queue",
        asb:PEEK_LOCK);

    asb:Message? message = check receiver->receive(30);
    if message is asb:Message {
        log:printInfo("Received", body = message.body.toString());
        check receiver->complete(message);
    }
    check receiver->close();
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/asb/latest)
