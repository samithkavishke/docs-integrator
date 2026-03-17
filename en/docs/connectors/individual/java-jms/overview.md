---
title: "Java JMS"
description: "Overview of the ballerinax/java.jms connector for WSO2 Integrator."
---

# Java JMS

| | |
|---|---|
| **Package** | [`ballerinax/java.jms`](https://central.ballerina.io/ballerinax/java.jms/latest) |
| **Version** | 1.2.0 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/java.jms/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/java.jms/latest#functions) |

## Overview

The `ballerinax/java.jms` package provides an API to connect to external JMS providers such as Apache ActiveMQ and IBM MQ from Ballerina. This package supports both JMS 2.0 and JMS 1.0 APIs with minimal deviation from the standard JMS interface.

### Supported JMS classes

- Connection, Session
- Destination (Queue, Topic, TemporaryQueue, TemporaryTopic)
- Message (TextMessage, MapMessage, BytesMessage)
- MessageConsumer, MessageProducer

### Key capabilities

- **Producer**: Send text, map, and byte messages to queues and topics
- **Consumer**: Synchronous message consumption with receive timeout
- **Listener**: Asynchronous message consumption via Ballerina services
- **Multiple providers**: Works with ActiveMQ, IBM MQ, and other JMS-compliant brokers

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "java.jms"
version = "1.2.0"
```

You also need a JMS provider driver. For ActiveMQ:

```toml
[[platform.java21.dependency]]
path = "./libs/activemq-client-5.18.3.jar"
```

Or use the ActiveMQ driver package:

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;
```

### Send a message

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;

public function main() returns error? {
    jms:Connection connection = check new (
        initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl = "tcp://localhost:61616"
    );
    jms:Session session = check connection->createSession();
    jms:MessageProducer producer = check session.createProducer({
        'type: jms:QUEUE,
        name: "MyQueue"
    });

    check producer->send({ content: "Hello Ballerina!" });
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/java.jms/latest)
