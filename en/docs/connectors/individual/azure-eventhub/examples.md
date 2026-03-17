---
title: "Azure Event Hubs - Examples"
description: "Code examples for the ballerinax/azure_eventhub connector."
---

# Azure Event Hubs Examples

## Example 1: Publish Order Events

Stream order events from an HTTP service to Azure Event Hubs for downstream analytics processing.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

final eventhub:Client ehClient = check new ({
    sasKeyName: sasKeyName,
    sasKey: sasKey,
    resourceUri: resourceUri
});

service /orders on new http:Listener(8080) {

    resource function post .(@http:Payload json orderPayload) returns http:Accepted|error {
        string eventData = orderPayload.toJsonString();

        map<string> brokerProps = {
            "CorrelationId": check orderPayload.orderId,
            "PartitionKey": check orderPayload.customerId
        };
        map<string> customProps = {
            "EventType": "OrderCreated",
            "Source": "OrderService"
        };

        check ehClient->send("order-events", eventData, brokerProps, customProps);
        log:printInfo("Order event published", orderId = check orderPayload.orderId);

        return http:ACCEPTED;
    }
}
```

```toml
# Config.toml
sasKeyName = "OrderServicePolicy"
sasKey = "<your-sas-key>"
resourceUri = "https://my-namespace.servicebus.windows.net"
```

## Example 2: Batch Telemetry Ingestion

Collect IoT sensor readings and publish them in batches for efficient throughput.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/time;
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

type SensorReading record {|
    string deviceId;
    float temperature;
    float humidity;
    string timestamp;
|};

public function main() returns error? {
    eventhub:Client ehClient = check new ({
        sasKeyName: sasKeyName,
        sasKey: sasKey,
        resourceUri: resourceUri
    });

    // Simulate sensor readings
    SensorReading[] readings = [
        {deviceId: "sensor-001", temperature: 22.5, humidity: 45.0, timestamp: time:utcToString(time:utcNow())},
        {deviceId: "sensor-002", temperature: 23.1, humidity: 42.3, timestamp: time:utcToString(time:utcNow())},
        {deviceId: "sensor-003", temperature: 21.8, humidity: 48.7, timestamp: time:utcToString(time:utcNow())}
    ];

    eventhub:BatchEvent[] batchEvents = from SensorReading reading in readings
        select {
            data: reading.toJsonString(),
            brokerProperties: {"PartitionKey": reading.deviceId},
            userProperties: {"DeviceId": reading.deviceId, "ReadingType": "environmental"}
        };

    check ehClient->sendBatch("iot-telemetry", batchEvents);
    log:printInfo("Batch telemetry published", count = batchEvents.length());
}
```

## Example 3: Consumer Group Management

Set up and manage consumer groups for parallel event processing across multiple services.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

public function main() returns error? {
    eventhub:Client ehClient = check new ({
        sasKeyName: sasKeyName,
        sasKey: sasKey,
        resourceUri: resourceUri
    });

    string eventHubName = "order-events";

    // Create consumer groups for different downstream services
    string[] consumerGroups = ["analytics-service", "notification-service", "audit-service"];

    foreach string groupName in consumerGroups {
        do {
            check ehClient->createConsumerGroup(eventHubName, groupName);
            log:printInfo("Consumer group created", group = groupName);
        } on fail error e {
            log:printWarn("Consumer group may already exist", group = groupName, 'error = e);
        }
    }

    // List all consumer groups
    eventhub:ConsumerGroupList groupList = check ehClient->listConsumerGroups(eventHubName);
    io:println("Active consumer groups: ", groupList);

    // Get details for a specific group
    eventhub:ConsumerGroup analyticsGroup = check ehClient->getConsumerGroup(eventHubName, "analytics-service");
    io:println("Analytics group details: ", analyticsGroup);
}
```

## Example 4: Event Hub Monitoring and Audit

Retrieve Event Hub metadata, inspect partitions, and manage publisher policies.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

public function main() returns error? {
    eventhub:Client ehClient = check new ({
        sasKeyName: sasKeyName,
        sasKey: sasKey,
        resourceUri: resourceUri
    });

    // List all Event Hubs in the namespace
    eventhub:EventHubList hubs = check ehClient->listEventHubs();
    io:println("Available Event Hubs: ", hubs);

    // Get details for a specific Event Hub
    eventhub:EventHub hubDetails = check ehClient->getEventHub("order-events");
    io:println("Event Hub details: ", hubDetails);

    // Inspect partition information
    eventhub:Partition partition0 = check ehClient->getPartition("order-events", 0);
    io:println("Partition 0 details: ", partition0);

    // Revoke a misbehaving publisher
    check ehClient->revokePublisher("order-events", "compromised-publisher");
    log:printInfo("Publisher revoked");

    // List all revoked publishers
    eventhub:RevokedPublisherList revoked = check ehClient->listRevokedPublishers("order-events");
    io:println("Revoked publishers: ", revoked);

    // Restore a publisher after investigation
    check ehClient->resumePublisher("order-events", "compromised-publisher");
    log:printInfo("Publisher restored");
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Azure Event Hubs Documentation](https://learn.microsoft.com/en-us/azure/event-hubs/)
