---
title: "Snowflake"
description: "Overview of the ballerinax/snowflake connector for WSO2 Integrator."
---

# Snowflake Connector

| | |
|---|---|
| **Package** | [`ballerinax/snowflake`](https://central.ballerina.io/ballerinax/snowflake/latest) |
| **Version** | 2.2.1 |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/snowflake/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/snowflake/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-snowflake) |

## Overview

The `ballerinax/snowflake` connector enables access to Snowflake, a cloud-based data platform that provides a data warehouse as a service. Through the Ballerina SQL APIs, it supports executing DDL commands, DML operations, and queries against Snowflake databases with parameterized queries, connection pooling, and both password-based and key-pair authentication.

## Key Features

- **SQL operations** -- Full DDL and DML support through the `sql:Client` interface
- **Parameterized queries** -- Type-safe SQL with automatic parameter binding
- **Password authentication** -- Standard username/password credentials
- **Key-pair authentication** -- RSA key-pair based authentication for enhanced security
- **Warehouse management** -- Configure and use specific Snowflake warehouses
- **Database/schema selection** -- Target specific databases and schemas
- **Connection pooling** -- Built-in connection pool management
- **Stream-based results** -- Memory-efficient result streaming for large datasets

## Quick Start

```ballerina
import ballerinax/snowflake;
import ballerinax/snowflake.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string accountIdentifier = ?;
configurable string user = ?;
configurable string password = ?;

public function main() returns error? {
    snowflake:Client sfClient = check new (accountIdentifier, user, password);

    stream<record {| string name; int age; |}, sql:Error?> resultStream =
        sfClient->query(`SELECT name, age FROM MY_DB.PUBLIC.USERS`);

    check from var row in resultStream
        do {
            io:println(row.name);
        };

    check sfClient.close();
}
```

```toml
# Config.toml
accountIdentifier = "xy12345.us-east-1"
user = "my_user"
password = "my_password"
```

## How It Works

The Snowflake connector uses the Snowflake JDBC driver to connect to your Snowflake account. It provides the standard `sql:Client` operations (`query`, `queryRow`, `execute`, `batchExecute`, `call`). The connector requires an account identifier (your Snowflake account URL prefix), along with authentication credentials.

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Code examples and patterns
- [Ballerina Central](https://central.ballerina.io/ballerinax/snowflake/latest) -- Package page
