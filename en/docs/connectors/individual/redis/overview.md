---
title: "Redis"
description: "Overview of the ballerinax/redis connector for WSO2 Integrator."
---

# Redis Connector

| | |
|---|---|
| **Package** | [`ballerinax/redis`](https://central.ballerina.io/ballerinax/redis/latest) |
| **Version** | 3.2.0 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/redis/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/redis/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-redis) |

## Overview

The `ballerinax/redis` connector provides APIs to connect to Redis servers and manipulate key-value data, enabling you to use Redis as a database, cache, and message broker from WSO2 Integrator. It supports various Redis data structures including strings, hashes, lists, sets, sorted sets, and pub/sub messaging.

The connector is compatible with Redis server versions up to 7.2.x.

## Key Features

- **String operations** -- `get`, `set`, `mGet`, `mSet`, `append`, `incr`, `decr`, `incrByFloat`
- **Hash operations** -- `hGet`, `hSet`, `hDel`, `hGetAll`, `hMGet`, `hMSet`, `hExists`, `hKeys`, `hVals`
- **List operations** -- `lPush`, `rPush`, `lPop`, `rPop`, `lRange`, `lLen`, `lIndex`, `lSet`
- **Set operations** -- `sAdd`, `sMembers`, `sRem`, `sCard`, `sIsMember`, `sDiff`, `sUnion`, `sInter`
- **Sorted set operations** -- `zAdd`, `zRange`, `zRangeByScore`, `zRem`, `zScore`, `zRank`
- **Key management** -- `del`, `exists`, `expire`, `ttl`, `keys`, `rename`, `type`
- **Pub/Sub** -- `publish` and `subscribe` for message passing
- **Connection pooling** -- Configurable connection pools for high-throughput workloads
- **Cluster support** -- Connect to Redis clusters
- **SSL/TLS** -- Secure connections for cloud-hosted Redis

## Quick Start

```ballerina
import ballerinax/redis;
import ballerina/io;

public function main() returns error? {
    redis:Client redis = check new (
        connection = {
            host: "localhost",
            port: 6379
        }
    );

    // Set and get a value
    check redis->set("greeting", "Hello, Redis!");
    string? value = check redis->get("greeting");
    io:println("Value: ", value);

    // Set with expiry (seconds)
    check redis->set("session:abc123", "user-data");
    check redis->expire("session:abc123", 3600);

    redis->close();
}
```

## Use Cases

- **Caching** -- Cache API responses, database query results, and computed values
- **Session management** -- Store and manage user sessions with automatic expiry
- **Rate limiting** -- Implement API rate limiting using counters with TTL
- **Real-time messaging** -- Pub/sub for event-driven architectures
- **Leaderboards** -- Sorted sets for ranking and scoring systems
- **Distributed locking** -- Coordinate access across distributed services

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/redis/latest) -- Package page
