---
title: "Apache Kafka - Setup"
description: "How to set up and configure the ballerinax/kafka connector."
---

# Apache Kafka Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Access to an Apache Kafka broker (local or remote)

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Apache Kafka**
4. Follow the connection wizard to enter your broker details

### Using code

Add the import to your Ballerina file:

```ballerina
import ballerinax/kafka;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "kafka"
version = "4.6.3"
```

## Configuration

### Producer configuration

Configure the Kafka producer with broker URL and optional settings:

```ballerina
import ballerinax/kafka;

configurable string bootstrapServers = ?;

kafka:ProducerConfiguration producerConfig = {
    clientId: "my-producer",
    acks: "all",
    retryCount: 3,
    maxBlock: 6,
    requestTimeout: 30,
    enableIdempotence: true
};

kafka:Producer producer = check new (bootstrapServers, producerConfig);
```

### Consumer configuration

Configure the Kafka consumer with group ID and topic subscriptions:

```ballerina
import ballerinax/kafka;

configurable string bootstrapServers = ?;
configurable string groupId = ?;

kafka:ConsumerConfiguration consumerConfig = {
    groupId: groupId,
    topics: ["topic-1", "topic-2"],
    offsetReset: "earliest",
    pollingInterval: 1,
    autoCommit: false,
    maxPollRecords: 100,
    sessionTimeout: 45,
    heartBeatInterval: 15
};

kafka:Consumer consumer = check new (bootstrapServers, consumerConfig);
```

### Provide values via Config.toml

```toml
# Config.toml
bootstrapServers = "localhost:9092"
groupId = "my-consumer-group"
```

## Authentication

### No authentication (development)

```ballerina
kafka:Producer producer = check new ("localhost:9092");
```

### SASL/PLAIN

```ballerina
kafka:ProducerConfiguration producerConfig = {
    clientId: "secured-producer",
    acks: "all",
    securityProtocol: kafka:PROTOCOL_SASL_PLAINTEXT,
    auth: {
        mechanism: kafka:AUTH_SASL_PLAIN,
        username: "admin",
        password: "admin-secret"
    }
};

kafka:Producer producer = check new ("broker:9093", producerConfig);
```

### SASL/SCRAM-SHA-256

```ballerina
kafka:ProducerConfiguration producerConfig = {
    clientId: "scram-producer",
    securityProtocol: kafka:PROTOCOL_SASL_PLAINTEXT,
    auth: {
        mechanism: kafka:AUTH_SASL_SCRAM_SHA_256,
        username: "admin",
        password: "admin-secret"
    }
};

kafka:Producer producer = check new ("broker:9093", producerConfig);
```

### SSL/TLS

```ballerina
kafka:ProducerConfiguration producerConfig = {
    clientId: "ssl-producer",
    securityProtocol: kafka:PROTOCOL_SSL,
    secureSocket: {
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePassword"
        },
        key: {
            path: "/path/to/keystore.p12",
            password: "keystorePassword"
        }
    }
};

kafka:Producer producer = check new ("broker:9094", producerConfig);
```

### SASL/SSL (production recommended)

```ballerina
kafka:ProducerConfiguration producerConfig = {
    clientId: "sasl-ssl-producer",
    securityProtocol: kafka:PROTOCOL_SASL_SSL,
    auth: {
        mechanism: kafka:AUTH_SASL_PLAIN,
        username: "admin",
        password: "admin-secret"
    },
    secureSocket: {
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePassword"
        }
    }
};

kafka:Producer producer = check new ("broker:9095", producerConfig);
```

## Verify the setup

After configuring, run your integration to verify the connection:

```bash
bal run
```

If you see authentication failures, verify your credentials in `Config.toml`. Common errors include:

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | Broker not reachable | Check `bootstrapServers` URL and port |
| `Authentication failed` | Invalid credentials | Verify username/password in `Config.toml` |
| `SSL handshake failed` | Certificate mismatch | Check truststore/keystore paths and passwords |
| `Group coordinator not available` | Broker still starting | Wait and retry; check broker logs |

## Next steps

- [Actions Reference](actions) -- Producer, consumer, and listener operations
- [Examples](examples) -- End-to-end code examples
