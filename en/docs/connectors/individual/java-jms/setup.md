---
title: "Java JMS - Setup"
description: "How to set up and configure the ballerinax/java.jms connector."
---

# Java JMS Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A JMS-compliant message broker (Apache ActiveMQ, IBM MQ, etc.)

## Installation

```ballerina
import ballerinax/java.jms;
```

```toml
[[dependency]]
org = "ballerinax"
name = "java.jms"
version = "1.2.0"
```

### JMS provider driver

You need the JMS provider's Java client library. For Apache ActiveMQ, use the driver package:

```ballerina
import ballerinax/activemq.driver as _;
```

```toml
[[dependency]]
org = "ballerinax"
name = "activemq.driver"
version = "0.1.0"
```

Or add the JAR directly:

```toml
[[platform.java21.dependency]]
groupId = "org.apache.activemq"
artifactId = "activemq-client"
version = "5.18.3"
```

## Configuration

### ActiveMQ connection

```ballerina
configurable string providerUrl = ?;

jms:Connection connection = check new (
    initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
    providerUrl = providerUrl
);
```

### IBM MQ connection via JMS

```ballerina
jms:Connection connection = check new (
    initialContextFactory = "com.ibm.mq.jms.MQQueueConnectionFactory",
    providerUrl = "localhost:1414/CHANNEL_NAME"
);
```

### Create a session

```ballerina
jms:Session session = check connection->createSession();
```

### Config.toml

```toml
# Config.toml
providerUrl = "tcp://localhost:61616"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `ClassNotFoundException` | Missing JMS driver JAR | Add provider dependency to `Ballerina.toml` |
| `Connection refused` | Broker not running | Start the JMS broker |
| `Security exception` | Invalid credentials | Check username/password |

## Next steps

- [Actions Reference](actions) -- Producer, consumer, and listener operations
- [Examples](examples) -- Code examples
