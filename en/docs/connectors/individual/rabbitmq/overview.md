---
title: "RabbitMQ"
description: "Overview of the ballerinax/rabbitmq connector for WSO2 Integrator."
---

# RabbitMQ

| | |
|---|---|
| **Package** | [`ballerinax/rabbitmq`](https://central.ballerina.io/ballerinax/rabbitmq/latest) |
| **Version** | 3.3.2 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/rabbitmq/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/rabbitmq/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-rabbitmq) |

## Overview

The `ballerinax/rabbitmq` package provides the capability to send and receive messages by connecting to a RabbitMQ server. RabbitMQ is one of the most popular open-source message brokers, offering a lightweight and easy-to-deploy solution for on-premise and cloud environments.

### Key capabilities

- **Publisher**: Publish messages to exchanges and queues with routing keys and message properties
- **Listener**: Consume messages using Ballerina services with automatic delivery and acknowledgment
- **Exchanges and queues**: Declare, bind, and manage AMQP exchanges and queues
- **Acknowledgments**: Auto-ack and client-ack (positive and negative) modes for reliable delivery
- **Request-reply**: Built-in support for synchronous request-reply messaging via `onRequest`
- **TLS security**: Encrypted connections with certificate-based authentication

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "rabbitmq"
version = "3.3.2"
```

```ballerina
import ballerinax/rabbitmq;
import ballerina/log;

public function main() returns error? {
    rabbitmq:Client rabbitmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

    check rabbitmqClient->queueDeclare("my-queue");
    string message = "Hello from Ballerina";
    check rabbitmqClient->publishMessage({
        content: message.toBytes(),
        routingKey: "my-queue"
    });
    log:printInfo("Message published successfully");
}
```

### Listener example

```ballerina
import ballerinax/rabbitmq;
import ballerina/log;

listener rabbitmq:Listener rmqListener = new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

@rabbitmq:ServiceConfig {
    queueName: "my-queue"
}
service rabbitmq:Service on rmqListener {
    remote function onMessage(rabbitmq:AnydataMessage message) {
        log:printInfo("Received message", content = message.content.toString());
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/rabbitmq/latest)
