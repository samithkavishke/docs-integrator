---
sidebar_position: 2
title: Event Handlers
description: Build reactive integrations triggered by Kafka, RabbitMQ, NATS, and MQTT.
---

# Event Handlers

Event handlers are reactive integrations triggered by messages from external systems. They use the Ballerina listener pattern to subscribe to message brokers and process events in real time.

## Kafka Consumer

### Setup and Configuration

Create a Kafka consumer service that listens to one or more topics.

```ballerina
import ballerinax/kafka;
import ballerina/log;

type Order readonly & record {
    int orderId;
    string productName;
    decimal price;
    boolean isValid;
};

listener kafka:Listener orderListener = new (kafka:DEFAULT_URL, {
    groupId: "order-processing-group",
    topics: ["order-topic"],
    pollingInterval: 1
});

service on orderListener {

    remote function onConsumerRecord(Order[] orders) returns error? {
        foreach Order 'order in orders {
            log:printInfo("Processing order", orderId = 'order.orderId);
            check processOrder('order);
        }
    }

    remote function onError(kafka:Error e) {
        log:printError("Kafka consumer error", 'error = e);
    }
}
```

### Consumer Configuration Options

Configure the consumer with authentication, deserialization, and offset management.

```ballerina
listener kafka:Listener secureListener = new ("kafka.example.com:9093", {
    groupId: "secure-group",
    topics: ["events"],
    secureSocket: {
        cert: "./certs/ca-cert.pem"
    },
    auth: {
        username: "user",
        password: "secret"
    },
    autoCommit: false  // Manual offset commit
});
```

### Manual Offset Commit

When `autoCommit` is disabled, commit offsets after successful processing.

```ballerina
service on orderListener {

    remote function onConsumerRecord(kafka:Caller caller, Order[] orders) returns error? {
        foreach Order 'order in orders {
            check processOrder('order);
        }
        // Commit only after successful processing
        check caller->commit();
    }
}
```

## RabbitMQ Consumer

Consume messages from a RabbitMQ queue with automatic payload deserialization.

```ballerina
import ballerinax/rabbitmq;
import ballerina/log;

type Notification record {
    string recipient;
    string subject;
    string body;
};

service "NotificationQueue" on new rabbitmq:Listener(
        rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT) {

    remote function onMessage(Notification notification) returns error? {
        log:printInfo("Sending notification", recipient = notification.recipient);
        check sendNotification(notification);
    }

    remote function onError(rabbitmq:Error e) {
        log:printError("RabbitMQ error", 'error = e);
    }
}
```

### Acknowledgment Control

Use `rabbitmq:Caller` for explicit acknowledgment or rejection of messages.

```ballerina
service "OrderQueue" on new rabbitmq:Listener(
        rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT) {

    remote function onMessage(rabbitmq:Caller caller, Order 'order) returns error? {
        do {
            check processOrder('order);
            check caller->basicAck();
        } on fail error e {
            log:printError("Processing failed, rejecting message", 'error = e);
            check caller->basicNack(requeue = true);
        }
    }
}
```

## NATS Subscriber

Subscribe to NATS subjects for lightweight, high-performance messaging.

```ballerina
import ballerinax/nats;
import ballerina/log;

type SensorReading record {
    string sensorId;
    decimal value;
    string unit;
};

service "sensors.temperature" on new nats:Listener(nats:DEFAULT_URL) {

    remote function onMessage(SensorReading reading) returns error? {
        if reading.value > 100.0 {
            log:printWarn("High temperature alert",
                sensorId = reading.sensorId,
                temperature = reading.value
            );
            check triggerAlert(reading);
        }
    }
}
```

### Queue Groups

Distribute messages across multiple instances using queue groups.

```ballerina
@nats:ServiceConfig {queueName: "temperature-processors"}
service "sensors.temperature" on new nats:Listener(nats:DEFAULT_URL) {

    remote function onMessage(SensorReading reading) returns error? {
        check processReading(reading);
    }
}
```

## MQTT Subscriber

Subscribe to MQTT topics for IoT and event-driven messaging.

```ballerina
import ballerina/mqtt;
import ballerina/log;

type DeviceEvent record {
    string deviceId;
    string eventType;
    json payload;
};

service on new mqtt:Listener(mqtt:DEFAULT_URL, "device-sub-client", "devices/+/events") {

    remote function onMessage(mqtt:Message message) returns error? {
        DeviceEvent event = check value:fromJsonStringWithType(
            check string:fromBytes(message.payload)
        );
        log:printInfo("Device event received",
            deviceId = event.deviceId,
            eventType = event.eventType
        );
        check routeEvent(event);
    }
}
```

## Common Patterns

### Error Handling for Event Processing

Use `do/on fail` blocks within message handlers to prevent a single bad message from crashing the consumer.

```ballerina
remote function onConsumerRecord(kafka:Caller caller, Order[] orders) returns error? {
    foreach Order 'order in orders {
        do {
            check processOrder('order);
        } on fail error e {
            log:printError("Failed to process order, sending to DLQ",
                orderId = 'order.orderId, 'error = e);
            check sendToDeadLetterQueue('order, e.message());
        }
    }
    check caller->commit();
}
```

### Dead Letter Queues

Route failed messages to a dead letter queue for later inspection and reprocessing.

```ballerina
final kafka:Producer dlqProducer = check new (kafka:DEFAULT_URL);

function sendToDeadLetterQueue(Order failedOrder, string reason) returns error? {
    json dlqMessage = {
        originalMessage: failedOrder.toJson(),
        failureReason: reason,
        failedAt: time:utcToString(time:utcNow())
    };
    check dlqProducer->send({
        topic: "order-topic-dlq",
        value: dlqMessage.toJsonString().toBytes()
    });
}
```

### Acknowledgment Strategies

| Strategy | Behavior | Use When |
|---|---|---|
| **Auto-commit** | Offsets committed automatically on poll | Processing failures are acceptable |
| **Manual commit** | Commit after successful processing | At-least-once delivery required |
| **Per-message ack** | Acknowledge each message individually | Fine-grained control needed |

## What's Next

- [Automations](automations.md) -- Schedule recurring tasks
- [Error Handling](error-handling.md) -- Retry and circuit breaker patterns
