---
title: "Oracle Database"
description: "Overview of the ballerinax/oracledb connector for WSO2 Integrator."
---

# Oracle Database Connector

| | |
|---|---|
| **Package** | [`ballerinax/oracledb`](https://central.ballerina.io/ballerinax/oracledb/latest) |
| **Version** | 1.15.0 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/oracledb/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/oracledb/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-oracledb) |

## Overview

The `ballerinax/oracledb` connector provides the functionality required to access and manipulate data stored in an Oracle Database from WSO2 Integrator. Built on the Ballerina `sql` module, it supports parameterized queries, connection pooling, SSL/TLS, stored procedures with PL/SQL, and Oracle-specific data types.

The connector supports OracleDB driver versions above 12.2.0.1.

## Key Features

- **Parameterized queries** -- Type-safe SQL with automatic parameter binding
- **Connection pooling** -- Built-in pool management with configurable sizes
- **SSL/TLS support** -- Encrypted connections with certificate-based authentication
- **PL/SQL stored procedures** -- Execute stored procedures and functions with IN, OUT, INOUT parameters
- **Batch operations** -- Execute multiple DML statements in a single batch
- **Transaction support** -- Full ACID transaction support
- **Stream-based results** -- Memory-efficient result streaming
- **GraalVM native support** -- Native compilation with `ballerinax/oracledb.driver`
- **Oracle-specific types** -- Support for Oracle XML, CLOB, BLOB, and custom object types

## Quick Start

```ballerina
import ballerinax/oracledb;
import ballerinax/oracledb.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 1521;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

public function main() returns error? {
    oracledb:Client dbClient = check new (
        host = dbHost,
        port = dbPort,
        user = dbUser,
        password = dbPassword,
        database = dbName
    );

    stream<record {| int id; string name; |}, sql:Error?> resultStream =
        dbClient->query(`SELECT id, name FROM employees`);

    check from var emp in resultStream
        do {
            io:println(emp.name);
        };

    check dbClient.close();
}
```

```toml
# Config.toml
dbUser = "admin"
dbPassword = "oracle123"
dbName = "ORCLCDB.localdomain"
```

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/oracledb/latest) -- Package page
