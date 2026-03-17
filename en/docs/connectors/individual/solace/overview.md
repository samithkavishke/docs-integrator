---
title: "Solace PubSub+"
description: "Overview of the ballerinax/solace connector for WSO2 Integrator."
---

# Solace PubSub+

| | |
|---|---|
| **Package** | [`ballerinax/solace`](https://central.ballerina.io/ballerinax/solace/latest) |
| **Version** | 0.3.0 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/solace/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/solace/latest#functions) |

## Overview

The `ballerinax/solace` package provides APIs to interact with Solace PubSub+ brokers through the JMS API. Solace PubSub+ is an advanced event-broker platform that enables event-driven communication using multiple messaging patterns including publish/subscribe, request/reply, and queue-based messaging.

### Key capabilities

- **Message producer**: Send messages to Solace queues and topics
- **Message consumer**: Receive messages from Solace queues with configurable timeouts
- **Queue and topic support**: Both point-to-point and pub/sub messaging patterns
- **Authentication**: Username/password-based authentication with Message VPN support
- **Protocol support**: JMS, MQTT, AMQP, and REST protocols via Solace PubSub+

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "solace"
version = "0.3.0"
```

### Send a message

```ballerina
import ballerinax/solace;
import ballerina/log;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string queueName = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    solace:MessageProducer producer = check new (brokerUrl,
        destination = { queueName },
        messageVpn = messageVpn,
        auth = { username, password }
    );

    check producer->send({ payload: "Hello Solace!" });
    log:printInfo("Message sent to Solace queue");
}
```

### Receive a message

```ballerina
import ballerinax/solace;
import ballerina/log;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string queueName = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    solace:MessageConsumer consumer = check new (brokerUrl,
        destination = { queueName },
        messageVpn = messageVpn,
        auth = { username, password }
    );

    solace:Message? msg = check consumer->receive(5.0);
    if msg is solace:Message {
        log:printInfo("Received", payload = msg.payload);
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/solace/latest)
