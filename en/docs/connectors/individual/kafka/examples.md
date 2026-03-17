---
title: "Apache Kafka - Examples"
description: "Code examples for the ballerinax/kafka connector."
---

# Apache Kafka Examples

## Example 1: Order processing pipeline

A producer service accepts HTTP orders and publishes them to Kafka. A consumer service processes orders from the topic.

### Producer service

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/kafka;

configurable string bootstrapServers = "localhost:9092";

type Order record {|
    string orderId;
    string customerId;
    string product;
    int quantity;
    decimal price;
|};

final kafka:Producer orderProducer = check new (bootstrapServers, {
    clientId: "order-service",
    acks: "all",
    retryCount: 3,
    enableIdempotence: true
});

service /api on new http:Listener(8080) {
    resource function post orders(Order order) returns http:Created|http:InternalServerError {
        do {
            string payload = order.toJsonString();
            check orderProducer->send({
                topic: "orders",
                key: order.orderId.toBytes(),
                value: payload.toBytes(),
                headers: {
                    "source": "web-api".toBytes()
                }
            });
            log:printInfo("Order published", orderId = order.orderId);
            return http:CREATED;
        } on fail error e {
            log:printError("Failed to publish order", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Consumer service

```ballerina
import ballerina/log;
import ballerinax/kafka;

configurable string bootstrapServers = "localhost:9092";

type Order record {|
    string orderId;
    string customerId;
    string product;
    int quantity;
    decimal price;
|};

kafka:ConsumerConfiguration consumerConfig = {
    groupId: "order-processors",
    topics: ["orders"],
    offsetReset: "earliest",
    pollingInterval: 1,
    autoCommit: false
};

listener kafka:Listener orderListener = new (bootstrapServers, consumerConfig);

service on orderListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var record in records {
            do {
                string jsonStr = check string:fromBytes(record.value);
                Order order = check jsonStr.fromJsonStringWithType();
                check processOrder(order);
                log:printInfo("Order processed",
                    orderId = order.orderId,
                    partition = record.partition,
                    offset = record.offset);
            } on fail error e {
                log:printError("Failed to process order",
                    offset = record.offset, 'error = e);
            }
        }
        check caller->commit();
    }
}

function processOrder(Order order) returns error? {
    log:printInfo("Processing order",
        orderId = order.orderId,
        product = order.product,
        total = order.quantity * order.price);
}
```

## Example 2: Secured Kafka with SASL/SSL

```ballerina
import ballerina/log;
import ballerinax/kafka;

configurable string bootstrapServers = ?;
configurable string username = ?;
configurable string password = ?;
configurable string truststorePath = ?;
configurable string truststorePassword = ?;

kafka:ProducerConfiguration securedConfig = {
    clientId: "secured-producer",
    acks: "all",
    securityProtocol: kafka:PROTOCOL_SASL_SSL,
    auth: {
        mechanism: kafka:AUTH_SASL_PLAIN,
        username: username,
        password: password
    },
    secureSocket: {
        cert: {
            path: truststorePath,
            password: truststorePassword
        }
    }
};

public function main() returns error? {
    kafka:Producer producer = check new (bootstrapServers, securedConfig);

    check producer->send({
        topic: "secure-topic",
        value: "Secured message".toBytes()
    });

    log:printInfo("Secured message sent successfully");
    check producer->close();
}
```

## Example 3: Consumer group with multiple partitions

```ballerina
import ballerina/log;
import ballerinax/kafka;

configurable string bootstrapServers = "localhost:9092";

// Each instance of this service joins the same consumer group.
// Kafka automatically distributes partitions among group members.
kafka:ConsumerConfiguration groupConfig = {
    groupId: "analytics-group",
    topics: ["events"],
    offsetReset: "latest",
    pollingInterval: 1,
    autoCommit: false,
    maxPollRecords: 500,
    sessionTimeout: 30,
    heartBeatInterval: 10
};

listener kafka:Listener eventsListener = new (bootstrapServers, groupConfig);

service on eventsListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        log:printInfo("Batch received", count = records.length());

        foreach var record in records {
            string value = check string:fromBytes(record.value);
            log:printInfo("Event processed",
                topic = record.topic,
                partition = record.partition,
                offset = record.offset);
        }

        check caller->commit();
    }
}
```

## Example 4: Dead-letter queue pattern

```ballerina
import ballerina/log;
import ballerinax/kafka;

configurable string bootstrapServers = "localhost:9092";

final kafka:Producer dlqProducer = check new (bootstrapServers, {
    clientId: "dlq-producer",
    acks: "all"
});

kafka:ConsumerConfiguration consumerConfig = {
    groupId: "main-processors",
    topics: ["incoming-events"],
    offsetReset: "earliest",
    autoCommit: false
};

listener kafka:Listener mainListener = new (bootstrapServers, consumerConfig);

service on mainListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var record in records {
            do {
                string value = check string:fromBytes(record.value);
                check processEvent(value);
            } on fail error e {
                log:printError("Sending to DLQ", 'error = e);
                // Send failed message to dead-letter topic
                check dlqProducer->send({
                    topic: "incoming-events-dlq",
                    key: record.key,
                    value: record.value,
                    headers: {
                        "original-topic": record.topic.toBytes(),
                        "error-message": e.message().toBytes()
                    }
                });
            }
        }
        check caller->commit();
    }
}

function processEvent(string event) returns error? {
    // Business logic that may fail
    log:printInfo("Processing event: " + event);
}
```

## Example 5: Config.toml for production

```toml
# Config.toml
bootstrapServers = "kafka-broker-1:9093,kafka-broker-2:9093"
username = "app-user"
password = "secure-password"
truststorePath = "/certs/truststore.p12"
truststorePassword = "changeit"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
