---
title: "IBM MQ"
description: "Overview of the ballerinax/ibm.ibmmq connector for WSO2 Integrator."
---

# IBM MQ

| | |
|---|---|
| **Package** | [`ballerinax/ibm.ibmmq`](https://central.ballerina.io/ballerinax/ibm.ibmmq/latest) |
| **Version** | 1.4.2 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ibm.ibmmq/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ibm.ibmmq/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-ibm.ibmmq) |

## Overview

The `ballerinax/ibm.ibmmq` package provides an API to connect to IBM MQ servers using Ballerina. IBM MQ is a powerful messaging middleware platform for reliable, asynchronous communication between systems. This connector supports IBM MQ server versions up to 9.3 and both point-to-point (queues) and publish/subscribe (topics) messaging models.

### Key capabilities

- **Queue manager**: Connect to IBM MQ queue managers with channel and authentication configuration
- **Queue operations**: Put and get messages from IBM MQ queues
- **Topic operations**: Publish and subscribe to IBM MQ topics
- **Message types**: Support for text, binary, and header (MQIIH, MQRFH2) message formats
- **TLS security**: Secure connections with SSL/TLS certificates

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "ibm.ibmmq"
version = "1.4.2"
```

You also need the IBM MQ client library:

```toml
[[platform.java21.dependency]]
groupId = "com.ibm.mq"
artifactId = "com.ibm.mq.allclient"
version = "9.3.4.0"
```

```ballerina
import ballerinax/ibm.ibmmq;
import ballerina/log;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

public function main() returns error? {
    ibmmq:QueueManager queueManager = check new (
        name = queueManagerName, host = host, port = port,
        channel = channel, userID = userID, password = password
    );

    ibmmq:Queue queue = check queueManager.accessQueue("DEV.QUEUE.1",
        ibmmq:MQOO_OUTPUT | ibmmq:MQOO_INPUT_AS_Q_DEF);

    // Put a message
    check queue->put({ payload: "Hello IBM MQ".toBytes() });

    // Get a message
    ibmmq:Message? msg = check queue->get();
    if msg is ibmmq:Message {
        log:printInfo("Received", payload = check string:fromBytes(msg.payload));
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/ibm.ibmmq/latest)
