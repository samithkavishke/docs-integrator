---
title: "Database Connectors"
description: "Connect to relational and NoSQL databases from WSO2 Integrator."
---

# Database Connectors

WSO2 Integrator provides native connectors for all major relational and NoSQL databases through the `ballerinax` package ecosystem. Each connector handles connection pooling, parameterized queries, transactions, and SSL/TLS out of the box.

## Relational Databases

| Connector | Package | Description |
|-----------|---------|-------------|
| **MySQL** | `ballerinax/mysql` | Full CRUD, stored procedures, SSL, CDC listener, XA transactions |
| **PostgreSQL** | `ballerinax/postgresql` | Full CRUD, CDC listener, native type support (UUID, JSON, arrays, geometric) |
| **MS SQL Server** | `ballerinax/mssql` | Full CRUD, stored procedures, CDC listener, Windows/SQL auth |
| **Oracle DB** | `ballerinax/oracledb` | Full CRUD, stored procedures, Oracle-specific types |
| **H2** | `ballerinax/h2` | Embedded and server mode, in-memory databases |
| **Snowflake** | `ballerinax/snowflake` | Cloud data warehouse queries and operations |

All relational connectors share the `ballerina/sql` base module, so query syntax is consistent across databases.

### Core Operations (All Relational)

| Operation | Description |
|-----------|-------------|
| `query()` | Execute a SELECT returning a stream of typed records |
| `queryRow()` | Retrieve a single row or aggregated value |
| `execute()` | Run INSERT, UPDATE, DELETE, or DDL statements |
| `batchExecute()` | Process multiple parameterized statements in a batch |
| `call()` | Invoke stored procedures with result mapping |

### Usage Example (MySQL)

```ballerina
import ballerinax/mysql;
import ballerina/sql;

configurable string dbHost = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

final mysql:Client db = check new (
    host = dbHost, user = dbUser, password = dbPassword,
    database = "orders_db", port = 3306
);

// Query - returns a stream of typed records
type Customer record {|
    int id;
    string name;
    string email;
|};

stream<Customer, sql:Error?> customers = db->query(
    `SELECT id, name, email FROM customers WHERE active = true`
);

// Single row
Customer customer = check db->queryRow(
    `SELECT * FROM customers WHERE id = ${customerId}`
);

// Insert
sql:ExecutionResult result = check db->execute(
    `INSERT INTO customers (name, email) VALUES (${name}, ${email})`
);

// Batch insert
sql:ParameterizedQuery[] inserts = from var c in newCustomers
    select `INSERT INTO customers (name, email) VALUES (${c.name}, ${c.email})`;
sql:ExecutionResult[] batchResult = check db->batchExecute(inserts);

// Stored procedure
sql:ProcedureCallResult callResult = check db->call(
    `CALL get_customer_orders(${customerId})`
);
```

## NoSQL Databases

| Connector | Package | Description |
|-----------|---------|-------------|
| **MongoDB** | `ballerinax/mongodb` | Document CRUD, aggregation pipelines, indexing, replica sets |
| **Redis** | `ballerinax/redis` | Strings, hashes, lists, sets, sorted sets, pub/sub |
| **DynamoDB** | `ballerinax/aws.dynamodb` | AWS managed NoSQL: tables, items, queries, scans |

### MongoDB Example

```ballerina
import ballerinax/mongodb;

mongodb:Client mongoDb = check new ({
    connection: {
        serverAddress: {host: "localhost", port: 27017},
        auth: <mongodb:ScramSha256AuthCredential>{
            username: "admin",
            password: "secret",
            database: "admin"
        }
    }
});

mongodb:Database db = check mongoDb->getDatabase("myapp");
mongodb:Collection users = check db->getCollection("users");

// Insert
check users->insertOne({name: "Alice", email: "alice@example.com"});

// Find
stream<record {string name; string email;}, error?> results =
    check users->find({name: "Alice"});

// Aggregation
stream<record {}, error?> pipeline = check users->aggregate([
    {"$match": {"status": "active"}},
    {"$group": {"_id": "$department", "count": {"$sum": 1}}}
]);
```

### Redis Example

```ballerina
import ballerinax/redis;

redis:Client redis = check new (
    connection = {host: "localhost", port: 6379}
);

// String operations
check redis->set("session:abc123", "user-data");
string? value = check redis->get("session:abc123");

// Hash operations
check redis->hSet("user:1001", {"name": "Alice", "role": "admin"});
string? name = check redis->hGet("user:1001", "name");

// List operations
check redis->lPush("task-queue", ["task-1", "task-2"]);
string? task = check redis->rPop("task-queue");
```

## Change Data Capture (CDC)

MySQL, PostgreSQL, and MS SQL Server connectors support CDC listeners for real-time database event streaming:

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.cdc as cdc;

listener cdc:Listener cdcListener = check new ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "mydb"
});

service on cdcListener {
    remote function onInsert(cdc:InsertEvent event) {
        // React to new rows
    }

    remote function onUpdate(cdc:UpdateEvent event) {
        // React to changed rows
    }

    remote function onDelete(cdc:DeleteEvent event) {
        // React to deleted rows
    }
}
```

## Connection Pooling

All relational connectors support connection pool configuration:

```ballerina
mysql:Client db = check new (
    host = "localhost", user = "root", password = "pass",
    database = "mydb", port = 3306,
    connectionPool = {
        maxOpenConnections: 10,
        maxConnectionLifeTime: 300,
        minIdleConnections: 2
    }
);
```

## SSL/TLS

```ballerina
mysql:Client secureDb = check new (
    host = "db.example.com", user = "appuser",
    password = "secret", database = "production",
    port = 3306,
    options = {
        ssl: {
            mode: mysql:SSL_REQUIRED,
            key: {path: "/certs/client-keystore.p12", password: "pass"},
            cert: {path: "/certs/truststore.p12", password: "pass"}
        }
    }
);
```

## What's Next

- [Connection Configuration](configuration.md) — Set up database connections in the visual designer
- [Authentication Methods](authentication.md) — Supported auth types
- [Messaging Connectors](messaging.md) — Connect to Kafka, RabbitMQ, and more
