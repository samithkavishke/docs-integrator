---
title: "Apache Kafka - Actions"
description: "Available actions and operations for the ballerinax/kafka connector."
---

# Apache Kafka Actions

The `ballerinax/kafka` package provides Producer, Consumer, and Listener clients for interacting with Apache Kafka.

## Producer operations

### Initialize a producer

```ballerina
import ballerinax/kafka;

kafka:ProducerConfiguration producerConfig = {
    clientId: "order-producer",
    acks: "all",
    retryCount: 3,
    enableIdempotence: true
};

kafka:Producer producer = check new (kafka:DEFAULT_URL, producerConfig);
```

### Send a message

Send a single message to a topic:

```ballerina
check producer->send({
    topic: "orders",
    key: "order-123".toBytes(),
    value: "Order data here".toBytes()
});
```

### Send a message to a specific partition

```ballerina
check producer->send({
    topic: "orders",
    key: "order-123".toBytes(),
    value: "Order data here".toBytes(),
    partition: 2
});
```

### Send with headers

```ballerina
check producer->send({
    topic: "orders",
    key: "order-123".toBytes(),
    value: "Order data here".toBytes(),
    headers: {
        "correlation-id": "abc-123".toBytes(),
        "source": "web-app".toBytes()
    }
});
```

### Flush pending messages

Force all buffered messages to be sent:

```ballerina
check producer->flushRecords();
```

### Close the producer

```ballerina
check producer->close();
```

## Consumer operations

### Initialize a consumer

```ballerina
import ballerinax/kafka;

kafka:ConsumerConfiguration consumerConfig = {
    groupId: "order-processors",
    offsetReset: "earliest",
    topics: ["orders"]
};

kafka:Consumer consumer = check new (kafka:DEFAULT_URL, consumerConfig);
```

### Poll for messages

```ballerina
kafka:BytesConsumerRecord[] records = check consumer->poll(1);

foreach var record in records {
    byte[] messageContent = record.value;
    string result = check string:fromBytes(messageContent);
    io:println("Received: ", result);
}
```

### Subscribe and unsubscribe

```ballerina
// Subscribe to topics
check consumer->subscribe(["orders", "payments"]);

// Get current subscription
string[] topics = check consumer->getSubscription();

// Unsubscribe from all topics
check consumer->unsubscribe();
```

### Manual partition assignment

```ballerina
kafka:TopicPartition topicPartition = {
    topic: "orders",
    partition: 0
};
check consumer->assign([topicPartition]);
```

### Offset management

```ballerina
// Commit current offsets
check consumer->commit();

// Commit specific offsets
kafka:PartitionOffset partitionOffset = {
    partition: { topic: "orders", partition: 0 },
    offset: 150
};
check consumer->commitOffset([partitionOffset]);

// Seek to a specific offset
check consumer->seek({
    partition: { topic: "orders", partition: 0 },
    offset: 100
});

// Seek to beginning or end
check consumer->seekToBeginning([ { topic: "orders", partition: 0 } ]);
check consumer->seekToEnd([ { topic: "orders", partition: 0 } ]);
```

### Get topic partition info

```ballerina
kafka:TopicPartition[] partitions = check consumer->getTopicPartitions("orders");
```

### Close the consumer

```ballerina
check consumer->close();
```

## Listener (event-driven consumption)

### Basic listener with auto-commit

```ballerina
import ballerinax/kafka;
import ballerina/log;

kafka:ConsumerConfiguration listenerConfig = {
    groupId: "order-listener-group",
    topics: ["orders"],
    pollingInterval: 1,
    autoCommit: true
};

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, listenerConfig);

service on kafkaListener {
    remote function onConsumerRecord(kafka:BytesConsumerRecord[] records) {
        foreach var record in records {
            string|error value = string:fromBytes(record.value);
            if value is string {
                log:printInfo("Received: " + value);
            }
        }
    }
}
```

### Listener with manual commit

```ballerina
kafka:ConsumerConfiguration listenerConfig = {
    groupId: "order-listener-group",
    topics: ["orders"],
    pollingInterval: 1,
    autoCommit: false
};

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, listenerConfig);

service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var record in records {
            string value = check string:fromBytes(record.value);
            log:printInfo("Processing: " + value);
        }
        // Commit after successful processing
        check caller->commit();
    }
}
```

### Listener with error handling

```ballerina
service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var record in records {
            do {
                string value = check string:fromBytes(record.value);
                check processOrder(value);
            } on fail error e {
                log:printError("Failed to process record",
                    topic = record.topic,
                    offset = record.offset,
                    'error = e);
            }
        }
        check caller->commit();
    }
}
```

## Error handling

All connector operations return `kafka:Error` on failure. Use `check` to propagate errors or `do/on fail` for inline handling:

```ballerina
do {
    check producer->send({
        topic: "orders",
        value: payload.toBytes()
    });
} on fail kafka:Error e {
    log:printError("Failed to send message", 'error = e);
    // Implement retry or dead-letter logic
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
