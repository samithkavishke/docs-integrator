---
title: "PostgreSQL"
description: "Overview of the ballerinax/postgresql connector for WSO2 Integrator."
---

# PostgreSQL Connector

| | |
|---|---|
| **Package** | [`ballerinax/postgresql`](https://central.ballerina.io/ballerinax/postgresql/latest) |
| **Version** | 1.16.3 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/postgresql/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/postgresql/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-postgresql) |

## Overview

The `ballerinax/postgresql` connector provides the functionality required to access and manipulate data stored in a PostgreSQL database from WSO2 Integrator. Built on the Ballerina `sql` module, it supports parameterized queries, connection pooling, SSL/TLS connections, and PostgreSQL-specific features such as JSONB, arrays, and custom types.

The connector supports PostgreSQL driver versions above 42.2.18 and is compatible with PostgreSQL 10+ servers.

## Key Features

- **Parameterized queries** -- Type-safe SQL queries with automatic parameter binding
- **Connection pooling** -- Built-in pool management with configurable sizes
- **SSL/TLS support** -- Multiple modes: DISABLE, ALLOW, PREFERRED, REQUIRED, VERIFY_CA, VERIFY_IDENTITY
- **Stored procedures and functions** -- Execute PostgreSQL functions with IN, OUT, and INOUT parameters
- **Batch operations** -- Execute multiple DML statements in a single batch
- **Transaction support** -- Full ACID transaction support
- **Stream-based results** -- Memory-efficient result streaming for large datasets
- **GraalVM native support** -- Native compilation with `ballerinax/postgresql.driver`

## Quick Start

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

public function main() returns error? {
    postgresql:Client dbClient = check new (
        host = dbHost,
        port = dbPort,
        username = dbUser,
        password = dbPassword,
        database = dbName
    );

    stream<record {| int id; string name; |}, sql:Error?> resultStream =
        dbClient->query(`SELECT id, name FROM users`);

    check from var user in resultStream
        do {
            io:println(user.name);
        };

    check dbClient.close();
}
```

```toml
# Config.toml
dbUser = "postgres"
dbPassword = "postgres123"
dbName = "appdb"
```

## How It Works

The PostgreSQL connector wraps the PostgreSQL JDBC driver and exposes it through the Ballerina `sql:Client` interface. It provides the same five core operations as other SQL connectors (`query`, `queryRow`, `execute`, `batchExecute`, `call`) while supporting PostgreSQL-specific data types and features.

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/postgresql/latest) -- Package page
- [SQL Module Docs](https://central.ballerina.io/ballerina/sql/latest) -- Base SQL module reference
