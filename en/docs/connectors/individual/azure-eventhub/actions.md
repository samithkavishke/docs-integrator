---
title: "Azure Event Hubs - Actions"
description: "Available actions and operations for the ballerinax/azure_eventhub connector."
---

# Azure Event Hubs Actions

The `ballerinax/azure_eventhub` package provides a client with operations to send events, manage consumer groups, and administer Event Hubs within an Azure Event Hubs namespace.

## Client Initialization

```ballerina
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

eventhub:ConnectionConfig config = {
    sasKeyName: sasKeyName,
    sasKey: sasKey,
    resourceUri: resourceUri
};

eventhub:Client eventHubClient = check new (config);
```

## Event Publishing Operations

### Send Event

Send a single event to an Event Hub.

```ballerina
check eventHubClient->send("my-event-hub", "Hello from Ballerina!");
```

### Send Event with Broker Properties

Attach metadata to the event using broker properties.

```ballerina
map<string> brokerProperties = {
    "CorrelationId": "order-12345",
    "Label": "order-created"
};
check eventHubClient->send("my-event-hub", "Order created", brokerProperties);
```

### Send Event with Custom Properties

Send an event with custom application properties.

```ballerina
map<string> brokerProps = {};
map<string> customProps = {
    "Priority": "High",
    "Source": "OrderService"
};
check eventHubClient->send("my-event-hub", "Critical event", brokerProps, customProps);
```

### Send Batch Events

Publish a batch of events in a single request for higher throughput.

```ballerina
eventhub:BatchEvent[] events = [
    {data: "Event 1"},
    {data: "Event 2"},
    {data: "Event 3"}
];
check eventHubClient->sendBatch("my-event-hub", events);
```

### Send Batch with Broker and Custom Properties

```ballerina
eventhub:BatchEvent[] events = [
    {
        data: "Order created",
        brokerProperties: {"CorrelationId": "order-100"},
        userProperties: {"EventType": "OrderCreated"}
    },
    {
        data: "Order updated",
        brokerProperties: {"CorrelationId": "order-100"},
        userProperties: {"EventType": "OrderUpdated"}
    }
];
check eventHubClient->sendBatch("my-event-hub", events);
```

### Send to Specific Partition

Publish an event to a specific partition using a partition key.

```ballerina
map<string> brokerProps = {"PartitionKey": "customer-456"};
check eventHubClient->send("my-event-hub", "Customer event", brokerProps);
```

## Consumer Group Operations

### Create Consumer Group

Create a new consumer group on an Event Hub.

```ballerina
check eventHubClient->createConsumerGroup("my-event-hub", "my-consumer-group");
```

### List Consumer Groups

Retrieve all consumer groups for a given Event Hub.

```ballerina
eventhub:ConsumerGroupList result = check eventHubClient->listConsumerGroups("my-event-hub");
```

### Get Consumer Group

Get details for a specific consumer group.

```ballerina
eventhub:ConsumerGroup cg = check eventHubClient->getConsumerGroup("my-event-hub", "my-consumer-group");
```

### Delete Consumer Group

Remove a consumer group from an Event Hub.

```ballerina
check eventHubClient->deleteConsumerGroup("my-event-hub", "my-consumer-group");
```

## Event Hub Management Operations

### List Event Hubs

List all Event Hubs within the namespace.

```ballerina
eventhub:EventHubList hubList = check eventHubClient->listEventHubs();
```

### Get Event Hub

Get metadata and properties for a specific Event Hub.

```ballerina
eventhub:EventHub hub = check eventHubClient->getEventHub("my-event-hub");
```

### Get Partition Details

Retrieve details about a specific partition.

```ballerina
eventhub:Partition partition = check eventHubClient->getPartition("my-event-hub", 0);
```

## Publisher Policy Operations

### Revoke Publisher

Revoke a publisher so it can no longer send events.

```ballerina
check eventHubClient->revokePublisher("my-event-hub", "publisher-name");
```

### Resume Publisher

Resume a previously revoked publisher.

```ballerina
check eventHubClient->resumePublisher("my-event-hub", "publisher-name");
```

### List Revoked Publishers

Get the list of all revoked publishers for an Event Hub.

```ballerina
eventhub:RevokedPublisherList revoked = check eventHubClient->listRevokedPublishers("my-event-hub");
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for localized handling:

```ballerina
import ballerina/log;

do {
    check eventHubClient->send("my-event-hub", "test event");
    log:printInfo("Event sent successfully");
} on fail error e {
    log:printError("Failed to send event", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/azure_eventhub/3.1.0)
