---
title: "RabbitMQ - Setup"
description: "How to set up and configure the ballerinax/rabbitmq connector."
---

# RabbitMQ Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Access to a RabbitMQ server (local or remote)

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **RabbitMQ**
4. Follow the connection wizard to enter your RabbitMQ server details

### Using code

Add the import:

```ballerina
import ballerinax/rabbitmq;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "rabbitmq"
version = "3.3.2"
```

## Configuration

### Default connection

```ballerina
rabbitmq:Client rabbitmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);
```

### Custom host and port

```ballerina
configurable string host = ?;
configurable int port = ?;

rabbitmq:Client rabbitmqClient = check new (host, port);
```

### Authenticated connection

```ballerina
configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string password = ?;

rabbitmq:ConnectionConfiguration config = {
    username: username,
    password: password
};

rabbitmq:Client rabbitmqClient = check new (host, port, config);
```

### TLS-secured connection

```ballerina
rabbitmq:SecureSocket secureSocket = {
    cert: {
        path: "/path/to/truststore.p12",
        password: "truststorePassword"
    },
    key: {
        path: "/path/to/keystore.p12",
        password: "keystorePassword"
    }
};

rabbitmq:ConnectionConfiguration config = {
    username: "admin",
    password: "admin-secret",
    secureSocket: secureSocket
};

rabbitmq:Client rabbitmqClient = check new ("rmq.example.com", 5671, config);
```

### Provide values via Config.toml

```toml
# Config.toml
host = "localhost"
port = 5672
username = "guest"
password = "guest"
```

## Exchange and queue setup

### Declare an exchange

```ballerina
check rabbitmqClient->exchangeDeclare("order-exchange", rabbitmq:DIRECT_EXCHANGE);
```

Supported exchange types:
- `rabbitmq:DIRECT_EXCHANGE` -- route by exact routing key match
- `rabbitmq:FANOUT_EXCHANGE` -- broadcast to all bound queues
- `rabbitmq:TOPIC_EXCHANGE` -- route by routing key pattern
- `rabbitmq:HEADERS_EXCHANGE` -- route by message headers

### Declare a queue

```ballerina
check rabbitmqClient->queueDeclare("order-queue", {
    durable: true,
    exclusive: false,
    autoDelete: false
});
```

### Bind a queue to an exchange

```ballerina
check rabbitmqClient->queueBind("order-queue", "order-exchange", "order.created");
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | Server not running | Start RabbitMQ or check host/port |
| `ACCESS_REFUSED` | Bad credentials | Verify username/password |
| `CHANNEL_ERROR` | Queue/exchange conflict | Check existing declarations |

## Next steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
