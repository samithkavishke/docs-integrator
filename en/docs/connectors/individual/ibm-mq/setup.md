---
title: "IBM MQ - Setup"
description: "How to set up and configure the ballerinax/ibm.ibmmq connector."
---

# IBM MQ Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- IBM MQ server (local, Docker, or IBM Cloud)

## Installation

```ballerina
import ballerinax/ibm.ibmmq;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ibm.ibmmq"
version = "1.4.2"
```

### IBM MQ client library

Add the IBM MQ Java client as a platform dependency:

```toml
[[platform.java21.dependency]]
groupId = "com.ibm.mq"
artifactId = "com.ibm.mq.allclient"
version = "9.3.4.0"
```

## IBM MQ setup

### Using Docker (development)

```bash
docker run -d --name ibmmq \
  -e LICENSE=accept \
  -e MQ_QMGR_NAME=QM1 \
  -p 1414:1414 -p 9443:9443 \
  icr.io/ibm-messaging/mq:latest
```

Default credentials: `admin` / `passw0rd`

### Create a queue

1. Log into the IBM MQ console at `https://localhost:9443/ibmmq/console`
2. Click **Create a queue**
3. Select queue type (Local) and enter a name

### Create a topic

1. Navigate to **Manage** > **Events**
2. Click **Create** and enter topic details

## Configuration

### Queue manager connection

```ballerina
configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

ibmmq:QueueManager queueManager = check new (
    name = queueManagerName,
    host = host,
    port = port,
    channel = channel,
    userID = userID,
    password = password
);
```

### Access a queue

```ballerina
configurable string queueName = ?;

ibmmq:Queue queue = check queueManager.accessQueue(queueName,
    ibmmq:MQOO_OUTPUT | ibmmq:MQOO_INPUT_AS_Q_DEF);
```

### Access a topic

```ballerina
configurable string topicName = ?;
configurable string topicString = ?;

ibmmq:Topic topic = check queueManager.accessTopic(
    topicName, topicString,
    ibmmq:MQOO_OUTPUT | ibmmq:MQOO_INPUT_AS_Q_DEF
);
```

### TLS connection

```ballerina
ibmmq:QueueManager queueManager = check new (
    name = queueManagerName,
    host = host,
    port = port,
    channel = channel,
    userID = userID,
    password = password,
    sslCipherSuite = "TLS_RSA_WITH_AES_256_CBC_SHA256",
    secureSocket = {
        cert: { path: "/path/to/truststore.p12", password: "changeit" },
        key: { path: "/path/to/keystore.p12", password: "changeit" }
    }
);
```

### Config.toml

```toml
# Config.toml
queueManagerName = "QM1"
host = "localhost"
port = 1414
channel = "DEV.APP.SVRCONN"
userID = "admin"
password = "passw0rd"
queueName = "DEV.QUEUE.1"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `MQRC_NOT_AUTHORIZED` | Invalid credentials | Check userID/password |
| `MQRC_HOST_NOT_AVAILABLE` | Cannot reach server | Verify host/port |
| `MQRC_UNKNOWN_OBJECT_NAME` | Queue/topic not found | Create in MQ console |

## Next steps

- [Actions Reference](actions) -- Queue and topic operations
- [Examples](examples) -- Code examples
