---
title: "Change Data Capture - Actions"
description: "Available events and operations for the ballerinax/cdc connector."
---

# Change Data Capture Actions

The `ballerinax/cdc` module provides a Listener that captures real-time database changes (inserts, updates, deletes) using Debezium.

## Supported Databases

| Database | Driver Package | 
|----------|---------------|
| MySQL | `ballerinax/mysql.cdc.driver` |
| PostgreSQL | `ballerinax/postgresql.cdc.driver` |
| Microsoft SQL Server | `ballerinax/mssql.cdc.driver` |

## Listener Setup

```ballerina
import ballerina/log;
import ballerinax/cdc;
import ballerinax/mysql.cdc.driver as _;

configurable string host = "localhost";
configurable int port = 3306;
configurable string username = "cdc_user";
configurable string password = "cdc_pass";
configurable string database = "mydb";

listener cdc:Listener cdcListener = check new ({
    database: "MYSQL",
    host: host,
    port: port,
    username: username,
    password: password,
    databaseName: database,
    tables: ["mydb.orders", "mydb.customers"]
});
```

## Event Handler Service

```ballerina
service on cdcListener {

    // Called for every change event
    remote function onRead(record {} after) returns error? {
        log:printInfo("Initial snapshot record", data = after);
    }

    remote function onCreate(record {} after) returns error? {
        log:printInfo("New record inserted", data = after);
    }

    remote function onUpdate(record {} before, record {} after) returns error? {
        log:printInfo("Record updated", before = before, after = after);
    }

    remote function onDelete(record {} before) returns error? {
        log:printInfo("Record deleted", data = before);
    }

    remote function onError(cdc:Error 'error) returns error? {
        log:printError("CDC error", 'error = 'error);
    }
}
```

## Event Types

| Event | Method | Parameters |
|-------|--------|------------|
| Snapshot read | `onRead` | `after` - current record |
| Insert | `onCreate` | `after` - new record |
| Update | `onUpdate` | `before` - old record, `after` - new record |
| Delete | `onDelete` | `before` - deleted record |
| Error | `onError` | CDC error details |

## Configuration

```toml
# Config.toml
host = "localhost"
port = 3306
username = "cdc_user"
password = "cdc_pass"
database = "mydb"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
