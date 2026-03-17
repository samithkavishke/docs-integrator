---
title: "Google Cloud Pub/Sub - Actions"
description: "Available actions and operations for the ballerinax/gcloud.pubsub connector."
---

# Google Cloud Pub/Sub Actions

The `ballerinax/gcloud.pubsub` package provides a Publisher for sending messages and a Listener for receiving messages.

## Publisher operations

### Initialize the publisher

```ballerina
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string topicName = ?;
configurable string credentialsPath = ?;

pubsub:Publisher publisher = check new (topicName,
    projectId = projectId,
    credentials = { credentialsPath }
);
```

### Publish a simple message

```ballerina
string messageId = check publisher->publish({
    data: "Hello, Pub/Sub!".toBytes()
});
```

### Publish with attributes

```ballerina
string messageId = check publisher->publish({
    data: "Event data".toBytes(),
    attributes: {
        "source": "ballerina-app",
        "version": "1.0",
        "eventType": "order.created"
    }
});
```

### Publish with ordering key

```ballerina
check publisher->publish({
    data: "Ordered message 1".toBytes(),
    orderingKey: "customer-123"
});
```

### Publish a batch

```ballerina
string[] messageIds = check publisher->publishBatch([
    { data: "Message 1".toBytes() },
    { data: "Message 2".toBytes() },
    { data: "Message 3".toBytes() }
]);
```

### Close the publisher

```ballerina
check publisher->close();
```

## Listener (subscriber)

### Initialize the listener

```ballerina
configurable string subscriptionName = ?;

listener pubsub:Listener pubsubListener = check new (subscriptionName,
    projectId = projectId,
    credentials = { credentialsPath }
);
```

### Process messages with acknowledgment

```ballerina
service on pubsubListener {
    remote function onMessage(pubsub:PubSubMessage message,
            pubsub:Caller caller) returns error? {
        string data = check string:fromBytes(message.data);
        log:printInfo("Received: " + data);

        // Check attributes
        if message.attributes is map<string> {
            log:printInfo("Attributes", attrs = message.attributes);
        }

        // Acknowledge successful processing
        check caller->ack();
    }
}
```

### Negative acknowledgment (redelivery)

```ballerina
service on pubsubListener {
    remote function onMessage(pubsub:PubSubMessage message,
            pubsub:Caller caller) returns error? {
        do {
            check processMessage(message);
            check caller->ack();
        } on fail error e {
            log:printError("Processing failed, nacking", 'error = e);
            check caller->nack();
        }
    }
}
```

## Error handling

```ballerina
do {
    string id = check publisher->publish({ data: "test".toBytes() });
} on fail error e {
    log:printError("Pub/Sub operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
