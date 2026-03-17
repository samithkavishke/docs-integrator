---
title: "Microsoft SQL Server"
description: "Overview of the ballerinax/mssql connector for WSO2 Integrator."
---

# Microsoft SQL Server Connector

| | |
|---|---|
| **Package** | [`ballerinax/mssql`](https://central.ballerina.io/ballerinax/mssql/latest) |
| **Version** | 1.16.3 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/mssql/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/mssql/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-mssql) |

## Overview

The `ballerinax/mssql` connector provides the functionality required to access and manipulate data stored in a Microsoft SQL Server database from WSO2 Integrator. Built on the Ballerina `sql` module, it supports parameterized queries, connection pooling, TLS/SSL encrypted connections, stored procedures, and batch operations.

The connector supports MSSQL driver versions above 9.20 and is compatible with SQL Server 2016 and later.

## Key Features

- **Parameterized queries** -- Type-safe SQL queries with automatic parameter binding
- **Connection pooling** -- Built-in pool management with configurable sizes
- **TLS/SSL support** -- Encrypted connections with certificate-based authentication
- **Stored procedures** -- Execute stored procedures with IN, OUT, and INOUT parameters
- **Batch operations** -- Execute multiple DML statements in a single batch
- **Transaction support** -- Full ACID transaction support with commit and rollback
- **Stream-based results** -- Memory-efficient result streaming for large datasets
- **GraalVM native support** -- Native compilation with `ballerinax/mssql.driver`
- **Change Data Capture** -- Support for CDC-enabled databases

## Quick Start

```ballerina
import ballerinax/mssql;
import ballerinax/mssql.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 1433;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

public function main() returns error? {
    mssql:Client dbClient = check new (
        host = dbHost,
        port = dbPort,
        user = dbUser,
        password = dbPassword,
        database = dbName
    );

    stream<record {| int id; string name; |}, sql:Error?> resultStream =
        dbClient->query(`SELECT id, name FROM customers`);

    check from var customer in resultStream
        do {
            io:println(customer.name);
        };

    check dbClient.close();
}
```

```toml
# Config.toml
dbUser = "sa"
dbPassword = "YourStrong@Password"
dbName = "inventory"
```

## How It Works

The MSSQL connector wraps the Microsoft JDBC Driver for SQL Server and exposes it through the Ballerina `sql:Client` interface. It provides the same five core operations (`query`, `queryRow`, `execute`, `batchExecute`, `call`) as other SQL-based connectors, while supporting SQL Server-specific features like T-SQL stored procedures and CDC.

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/mssql/latest) -- Package page
