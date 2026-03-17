---
title: "Solace PubSub+ - Setup"
description: "How to set up and configure the ballerinax/solace connector."
---

# Solace PubSub+ Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Solace PubSub+ broker (local, Docker, or Solace Cloud)

## Installation

```ballerina
import ballerinax/solace;
```

```toml
[[dependency]]
org = "ballerinax"
name = "solace"
version = "0.3.0"
```

## Solace setup

### Using Docker (development)

```bash
docker run -d --name solace \
  -p 8080:8080 -p 55555:55555 \
  -e username_admin_globalaccesslevel=admin \
  -e username_admin_password=admin \
  solace/solace-pubsub-standard:latest
```

### Using Solace Cloud

1. Sign up at [Solace Cloud](https://cloud.solace.com/)
2. Create a messaging service
3. Note the connection details: host URL, Message VPN, username, password

## Configuration

### Producer configuration

```ballerina
configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string queueName = ?;
configurable string username = ?;
configurable string password = ?;

solace:MessageProducer producer = check new (brokerUrl,
    destination = { queueName },
    messageVpn = messageVpn,
    auth = { username, password }
);
```

### Consumer configuration

```ballerina
solace:MessageConsumer consumer = check new (brokerUrl,
    destination = { queueName },
    messageVpn = messageVpn,
    auth = { username, password }
);
```

### Config.toml

```toml
# Config.toml
brokerUrl = "tcp://localhost:55555"
messageVpn = "default"
queueName = "my-queue"
username = "admin"
password = "admin"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | Broker not running | Start Solace broker |
| `Authentication failed` | Bad credentials | Check username/password |
| `Unknown queue` | Queue not provisioned | Create queue in Solace manager |

## Next steps

- [Actions Reference](actions) -- Producer and consumer operations
- [Examples](examples) -- Code examples
