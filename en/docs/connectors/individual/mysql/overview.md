---
title: "MySQL"
description: "Overview of the ballerinax/mysql connector for WSO2 Integrator."
---

# MySQL Connector

| | |
|---|---|
| **Package** | [`ballerinax/mysql`](https://central.ballerina.io/ballerinax/mysql/latest) |
| **Version** | 1.16.2 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/mysql/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/mysql/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-mysql) |

## Overview

The `ballerinax/mysql` connector provides the functionality required to access and manipulate data stored in a MySQL database from WSO2 Integrator. Built on top of the Ballerina `sql` module, it offers a type-safe, convenient API for performing SQL operations including queries, inserts, updates, deletes, stored procedure calls, and batch operations.

The connector supports MySQL driver versions above 8.0.13 and is compatible with MySQL 5.7+ and MySQL 8.x servers.

## Key Features

- **Parameterized queries** -- Type-safe SQL queries with automatic parameter binding to prevent SQL injection
- **Connection pooling** -- Built-in connection pool management with configurable pool sizes
- **SSL/TLS support** -- Encrypted connections with multiple SSL modes (PREFERRED, REQUIRED, VERIFY_CA, VERIFY_IDENTITY)
- **Stored procedures** -- Execute stored procedures with IN, OUT, and INOUT parameters
- **Batch operations** -- Execute multiple DML statements in a single batch for improved performance
- **Transaction support** -- Full ACID transaction support with commit and rollback
- **Stream-based results** -- Memory-efficient result streaming for large datasets
- **GraalVM native support** -- Native compilation support when used with `ballerinax/mysql.driver`

## Quick Start

Add the MySQL driver dependency and import the connector:

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/sql;
```

Create a client and execute a query:

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

public function main() returns error? {
    mysql:Client dbClient = check new (
        host = dbHost,
        port = dbPort,
        user = dbUser,
        password = dbPassword,
        database = dbName
    );

    // Query with type-safe result mapping
    stream<record {| int id; string name; |}, sql:Error?> resultStream =
        dbClient->query(`SELECT id, name FROM customers`);

    check from var customer in resultStream
        do {
            io:println(customer.name);
        };

    check dbClient.close();
}
```

Provide credentials via `Config.toml`:

```toml
dbUser = "root"
dbPassword = "mysql123"
dbName = "inventory"
```

## How It Works

The MySQL connector wraps the standard MySQL JDBC driver and exposes it through Ballerina's `sql:Client` interface. When you create a `mysql:Client`, the connector:

1. Loads the MySQL JDBC driver (via `ballerinax/mysql.driver`)
2. Establishes a connection pool to the specified MySQL server
3. Provides type-safe operations (`query`, `queryRow`, `execute`, `batchExecute`, `call`) for database interaction
4. Automatically maps SQL result sets to Ballerina record types

All operations use parameterized queries (`sql:ParameterizedQuery`) that separate SQL structure from data values, preventing SQL injection vulnerabilities.

## Architecture

```
+---------------------+       +------------------+       +--------------+
| WSO2 Integrator     | ----> | mysql:Client     | ----> | MySQL Server |
| (Ballerina Service) |       | (Connection Pool)|       | (5.7+ / 8.x) |
+---------------------+       +------------------+       +--------------+
                                     |
                              +------+------+
                              | sql:Client  |
                              | (Base API)  |
                              +-------------+
```

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/mysql/latest) -- Package page
- [SQL Module Docs](https://central.ballerina.io/ballerina/sql/latest) -- Base SQL module reference
