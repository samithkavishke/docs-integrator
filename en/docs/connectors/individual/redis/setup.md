---
title: "Redis - Setup"
description: "How to set up and configure the ballerinax/redis connector."
---

# Redis Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running Redis server (up to 7.2.x)

## Step 1: Add Dependencies

### Import the Redis Package

```ballerina
import ballerinax/redis;
```

No separate driver import is needed.

## Step 2: Set Up Redis

### Option A: Local Redis Server

1. Install Redis from the [official website](https://redis.io/download/)
2. Start the Redis server:

```bash
redis-server
```

3. Verify connectivity:

```bash
redis-cli ping
# Expected response: PONG
```

### Option B: Cloud-Hosted Redis

Popular managed Redis services:

- **Redis Cloud** -- [redis.com](https://redis.com/)
- **Amazon ElastiCache** -- [aws.amazon.com/elasticache](https://aws.amazon.com/elasticache/)
- **Google Cloud Memorystore** -- [cloud.google.com/memorystore](https://cloud.google.com/memorystore)
- **Azure Cache for Redis** -- [azure.microsoft.com/products/cache](https://azure.microsoft.com/products/cache)

## Step 3: Configure the Connection

### Basic Connection

```ballerina
redis:Client redis = check new (
    connection = {
        host: "localhost",
        port: 6379
    }
);
```

### Using Configurable Variables (Recommended)

```ballerina
configurable string redisHost = "localhost";
configurable int redisPort = 6379;
configurable string redisPassword = ?;

redis:Client redis = check new (
    connection = {
        host: redisHost,
        port: redisPort,
        password: redisPassword
    }
);
```

```toml
# Config.toml
redisHost = "localhost"
redisPort = 6379
redisPassword = "your-redis-password"
```

### Connection with SSL/TLS

For cloud-hosted Redis services that require SSL:

```ballerina
redis:Client redis = check new (
    connection = {
        host: "redis-cluster.example.com",
        port: 6380,
        password: redisPassword
    },
    secureSocket = {
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePass"
        }
    }
);
```

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Redis**
4. Enter host, port, and optional password

### Connection Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Redis server hostname |
| `port` | `int` | `6379` | Redis server port |
| `password` | `string?` | `()` | Password for authentication |
| `database` | `int` | `0` | Redis database index (0-15) |

## Step 4: Verify the Connection

```ballerina
import ballerinax/redis;
import ballerina/io;

configurable string redisHost = "localhost";
configurable int redisPort = 6379;

public function main() returns error? {
    redis:Client redis = check new (
        connection = {
            host: redisHost,
            port: redisPort
        }
    );

    check redis->set("test:connection", "success");
    string? value = check redis->get("test:connection");
    io:println("Redis connection test: ", value);

    _ = check redis->del(["test:connection"]);
    redis->close();
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify Redis is running (`redis-cli ping`) |
| `NOAUTH Authentication required` | Provide the `password` in the connection config |
| `ERR invalid password` | Check the password matches Redis configuration |
| `Connection timed out` | Check firewall rules and network connectivity |
| `SSL/TLS error` | Verify certificate paths and that the Redis server supports TLS |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
