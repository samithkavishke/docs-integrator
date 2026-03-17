---
title: "Google Cloud Pub/Sub"
description: "Overview of the ballerinax/gcloud.pubsub connector for WSO2 Integrator."
---

# Google Cloud Pub/Sub

| | |
|---|---|
| **Package** | [`ballerinax/gcloud.pubsub`](https://central.ballerina.io/ballerinax/gcloud.pubsub/latest) |
| **Version** | 0.1.0 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/gcloud.pubsub/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/gcloud.pubsub/latest#functions) |

## Overview

The `ballerinax/gcloud.pubsub` package provides APIs to interact with Google Cloud Pub/Sub, a fully managed real-time messaging service that enables asynchronous communication between independent applications with scalable, durable message ingestion and delivery.

### Key capabilities

- **Publisher**: Publish messages to topics with attributes and ordering keys
- **Listener**: Subscribe to topics and process messages with automatic acknowledgment
- **Batch publishing**: Publish multiple messages in a single operation
- **Message ordering**: Guarantee message order using ordering keys
- **Acknowledgment control**: Acknowledge or negative-acknowledge messages for redelivery

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "gcloud.pubsub"
version = "0.1.0"
```

### Publish a message

```ballerina
import ballerinax/gcloud.pubsub;
import ballerina/log;

configurable string projectId = ?;
configurable string topicName = ?;
configurable string credentialsPath = ?;

public function main() returns error? {
    pubsub:Publisher publisher = check new (topicName,
        projectId = projectId,
        credentials = { credentialsPath }
    );

    string messageId = check publisher->publish({
        data: "Hello, Google Pub/Sub!".toBytes()
    });
    log:printInfo("Published", messageId = messageId);
    check publisher->close();
}
```

### Listen for messages

```ballerina
import ballerinax/gcloud.pubsub;
import ballerina/log;

configurable string projectId = ?;
configurable string subscriptionName = ?;
configurable string credentialsPath = ?;

listener pubsub:Listener pubsubListener = check new (subscriptionName,
    projectId = projectId,
    credentials = { credentialsPath }
);

service on pubsubListener {
    remote function onMessage(pubsub:PubSubMessage message,
            pubsub:Caller caller) returns error? {
        string data = check string:fromBytes(message.data);
        log:printInfo("Received: " + data);
        check caller->ack();
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/gcloud.pubsub/latest)
