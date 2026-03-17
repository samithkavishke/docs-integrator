---
title: "JDBC (Generic)"
description: "Overview of the ballerinax/java.jdbc connector for WSO2 Integrator."
---

# JDBC (Generic) Connector

| | |
|---|---|
| **Package** | [`ballerinax/java.jdbc`](https://central.ballerina.io/ballerinax/java.jdbc/latest) |
| **Version** | 1.14.1 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/java.jdbc/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/java.jdbc/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-java.jdbc) |

## Overview

The `ballerinax/java.jdbc` connector provides a generic interface to access and manipulate data stored in any relational database accessible via the Java Database Connectivity (JDBC) API. This connector is the universal choice when a database-specific connector (like `mysql`, `postgresql`, `mssql`) is not available, or when you need to connect to databases such as H2, SQLite, MariaDB, CockroachDB, or any other JDBC-compatible database.

## Key Features

- **Universal database access** -- Connect to any database with a JDBC driver
- **Standard SQL operations** -- `query`, `queryRow`, `execute`, `batchExecute`, `call`
- **Parameterized queries** -- Type-safe SQL with automatic parameter binding
- **Connection pooling** -- Built-in pool management with configurable sizes
- **Custom datasource support** -- Configure custom JDBC DataSource classes
- **Transaction support** -- Full ACID transaction support
- **Stream-based results** -- Memory-efficient result streaming

## When to Use JDBC vs Database-Specific Connectors

| Scenario | Recommended Connector |
|----------|----------------------|
| MySQL database | `ballerinax/mysql` |
| PostgreSQL database | `ballerinax/postgresql` |
| SQL Server database | `ballerinax/mssql` |
| Oracle database | `ballerinax/oracledb` |
| H2 embedded database | `ballerinax/java.jdbc` |
| SQLite database | `ballerinax/java.jdbc` |
| MariaDB database | `ballerinax/java.jdbc` |
| CockroachDB | `ballerinax/java.jdbc` |
| Any other JDBC database | `ballerinax/java.jdbc` |

Database-specific connectors provide optimized configurations and features for their target databases. Use the generic JDBC connector when no specific connector exists.

## Quick Start

```ballerina
import ballerinax/java.jdbc;
import ballerina/sql;
import ballerina/io;

configurable string jdbcUrl = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

public function main() returns error? {
    jdbc:Client dbClient = check new (
        url = jdbcUrl,
        user = dbUser,
        password = dbPassword
    );

    stream<record {| int id; string name; |}, sql:Error?> resultStream =
        dbClient->query(`SELECT id, name FROM users`);

    check from var row in resultStream
        do {
            io:println(row.name);
        };

    check dbClient.close();
}
```

```toml
# Config.toml -- H2 database example
jdbcUrl = "jdbc:h2:~/test"
dbUser = "sa"
dbPassword = ""
```

## How It Works

The JDBC connector accepts a standard JDBC URL and delegates to the appropriate JDBC driver. You must provide the corresponding JDBC driver JAR as a platform dependency in `Ballerina.toml`. The connector then provides the full `sql:Client` interface for all operations.

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/java.jdbc/latest) -- Package page
