---
title: "NATS - Setup"
description: "How to set up and configure the ballerinax/nats connector."
---

# NATS Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Access to a NATS server (local or remote)

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **NATS**
4. Follow the connection wizard

### Using code

```ballerina
import ballerinax/nats;
```

```toml
[[dependency]]
org = "ballerinax"
name = "nats"
version = "3.3.1"
```

## Configuration

### Default connection

```ballerina
nats:Client natsClient = check new (nats:DEFAULT_URL);
```

### Custom URL

```ballerina
configurable string natsUrl = ?;
nats:Client natsClient = check new (natsUrl);
```

### Multiple servers (cluster)

```ballerina
nats:Client natsClient = check new (
    ["nats://server1:4222", "nats://server2:4222"]
);
```

### Connection with custom configuration

```ballerina
nats:ConnectionConfiguration config = {
    connectionName: "my-nats-app",
    noEcho: true
};

nats:Client natsClient = check new (
    ["nats://server1:4222", "nats://server2:4222"],
    config
);
```

### TLS-secured connection

```ballerina
nats:SecureSocket secured = {
    cert: {
        path: "/path/to/truststore.p12",
        password: "truststorePassword"
    },
    key: {
        path: "/path/to/keystore.p12",
        password: "keystorePassword"
    }
};

nats:Client natsClient = check new ("nats://secure-server:4222", secureSocket = secured);
```

### TLS for the Listener

```ballerina
nats:SecureSocket secured = {
    cert: {
        path: "/path/to/truststore.p12",
        password: "password"
    },
    key: {
        path: "/path/to/keystore.p12",
        password: "password"
    }
};

nats:Listener natsListener = check new ("nats://secure-server:4222", secureSocket = secured);
```

### Config.toml

```toml
# Config.toml
natsUrl = "nats://localhost:4222"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | NATS server not running | Start NATS or check URL/port |
| `TLS handshake error` | Certificate mismatch | Verify cert paths and passwords |
| `Authorization violation` | Invalid token or creds | Check authentication config |

## Next steps

- [Actions Reference](actions) -- Client and listener operations
- [Examples](examples) -- Code examples
