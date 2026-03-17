---
title: "Apache Kafka"
description: "Overview of the ballerinax/kafka connector for WSO2 Integrator."
---

# Apache Kafka

| | |
|---|---|
| **Package** | [`ballerinax/kafka`](https://central.ballerina.io/ballerinax/kafka/latest) |
| **Version** | 4.6.3 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/kafka/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/kafka/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-kafka) |

## Overview

The `ballerinax/kafka` package provides an implementation to interact with Apache Kafka brokers via Kafka Producer and Kafka Consumer clients. Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

This package supports Kafka 1.x, 2.x, and 3.x versions.

### Key capabilities

- **Producer**: Publish records to Kafka topics with configurable serialization, partitioning, and acknowledgment strategies
- **Consumer**: Subscribe to topics and poll for records with configurable deserialization and offset management
- **Listener**: Event-driven message consumption using Ballerina service abstraction with automatic polling
- **Consumer groups**: Coordinate multiple consumers for parallel processing with automatic partition assignment
- **Security**: SASL/PLAIN, SASL/SCRAM, SSL/TLS, and mutual TLS authentication
- **Transactions**: Exactly-once semantics with transactional producers and consumers

## Quick start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "kafka"
version = "4.6.3"
```

Import and use in your Ballerina code:

```ballerina
import ballerinax/kafka;
import ballerina/log;

// Producer: send a message
public function main() returns error? {
    kafka:Producer producer = check new (kafka:DEFAULT_URL, {
        clientId: "my-producer",
        acks: "all",
        retryCount: 3
    });

    check producer->send({
        topic: "orders",
        key: "order-001".toBytes(),
        value: "New order placed".toBytes()
    });

    log:printInfo("Message sent successfully");
}
```

```ballerina
import ballerinax/kafka;
import ballerina/log;

// Listener: consume messages reactively
kafka:ConsumerConfiguration consumerConfig = {
    groupId: "order-processors",
    topics: ["orders"],
    offsetReset: "earliest",
    autoCommit: false
};

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, consumerConfig);

service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var record in records {
            string value = check string:fromBytes(record.value);
            log:printInfo("Received: " + value);
        }
        check caller->commit();
    }
}
```

## Architecture

The Kafka connector supports three primary interaction patterns:

1. **Producer pattern** -- Applications publish messages to named topics. The producer handles serialization, partitioning, and delivery guarantees.

2. **Consumer pattern** -- Applications poll topics for new messages. The consumer manages offset tracking, group membership, and deserialization.

3. **Listener pattern** -- The Ballerina listener abstracts the polling loop, delivering messages to service methods automatically.

## Related resources

- [Setup Guide](setup) -- Installation, configuration, and authentication
- [Actions Reference](actions) -- Producer, consumer, and listener API
- [Examples](examples) -- End-to-end integration patterns
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/kafka/latest)
