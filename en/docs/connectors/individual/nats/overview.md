---
title: "NATS"
description: "Overview of the ballerinax/nats connector for WSO2 Integrator."
---

# NATS

| | |
|---|---|
| **Package** | [`ballerinax/nats`](https://central.ballerina.io/ballerinax/nats/latest) |
| **Version** | 3.3.1 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/nats/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/nats/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-nats) |

## Overview

The `ballerinax/nats` package provides an implementation to interact with NATS servers. NATS is a cloud-native, open-source messaging system that provides high-performance, lightweight, and scalable communication infrastructure for modern distributed systems.

### Key capabilities

- **Publish/Subscribe**: Publish messages to subjects and subscribe with wildcard pattern matching
- **Request-reply**: Synchronous request-reply messaging with automatic reply routing
- **Queue groups**: Load-balanced message distribution across multiple subscribers
- **JetStream**: Persistent messaging with at-least-once and exactly-once delivery guarantees
- **TLS security**: Encrypted connections with certificate-based authentication
- **GraalVM compatible**: Native image builds for fast startup

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "nats"
version = "3.3.1"
```

### Publish a message

```ballerina
import ballerinax/nats;
import ballerina/log;

public function main() returns error? {
    nats:Client natsClient = check new (nats:DEFAULT_URL);

    string message = "Hello NATS";
    check natsClient->publishMessage({
        content: message.toBytes(),
        subject: "demo.subject"
    });
    log:printInfo("Message published");
}
```

### Subscribe to messages

```ballerina
import ballerinax/nats;
import ballerina/log;

@nats:ServiceConfig {
    subject: "demo.subject"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        log:printInfo("Received", content = message.content.toString());
    }
}
```

### Request-reply

```ballerina
import ballerinax/nats;

public function main() returns error? {
    nats:Client natsClient = check new (nats:DEFAULT_URL);

    nats:AnydataMessage reply = check natsClient->requestMessage({
        content: "What time is it?".toBytes(),
        subject: "time.service"
    }, 5);
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/nats/latest)
