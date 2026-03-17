---
title: "MySQL - Setup"
description: "How to set up and configure the ballerinax/mysql connector."
---

# MySQL Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running MySQL server (5.7+ or 8.x)

## Step 1: Add Dependencies

### Import the MySQL Package

Add the following imports to your Ballerina source file:

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/sql;
```

The `mysql.driver` import (with the `as _` alias) bundles the latest MySQL JDBC driver JAR automatically. This is the recommended approach.

### Alternative: Use a Specific Driver Version

If you need a specific MySQL driver version, add it as a platform dependency in `Ballerina.toml` instead of importing `mysql.driver`:

```toml
[[platform.java17.dependency]]
groupId = "mysql"
artifactId = "mysql-connector-java"
version = "8.0.33"
```

Or reference a locally downloaded JAR:

```toml
[[platform.java17.dependency]]
path = "./libs/mysql-connector-java-8.0.33.jar"
```

## Step 2: Configure the Connection

### Using Configurable Variables (Recommended)

Define configurable variables in your Ballerina code and provide values through `Config.toml`:

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

mysql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    user = dbUser,
    password = dbPassword,
    database = dbName
);
```

```toml
# Config.toml
dbHost = "localhost"
dbPort = 3306
dbUser = "root"
dbPassword = "mysql123"
dbName = "inventory_db"
```

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **MySQL**
4. Enter connection details (host, port, username, password, database)
5. The designer generates the corresponding Ballerina code automatically

### Inline Client Creation

For quick prototyping, you can create the client with inline values:

```ballerina
mysql:Client dbClient = check new (
    "localhost", "root", "password123", "mydb", 3306
);
```

## Step 3: Configure SSL (Optional)

### SSL Modes

The MySQL connector supports four SSL modes:

| Mode | Description |
|------|-------------|
| `mysql:SSL_PREFERRED` | Use SSL if the server supports it (default) |
| `mysql:SSL_REQUIRED` | Always use SSL; fail if the server does not support it |
| `mysql:SSL_VERIFY_CA` | Like REQUIRED, but also verify the server CA certificate |
| `mysql:SSL_VERIFY_IDENTITY` | Like VERIFY_CA, but also verify the server hostname |

### SSL Configuration Example

```ballerina
mysql:Options mysqlOptions = {
    ssl: {
        mode: mysql:SSL_VERIFY_CA,
        key: {
            path: "/path/to/client-keystore.p12",
            password: "keystorePassword"
        },
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePassword"
        }
    },
    connectTimeout: 10
};

mysql:Client dbClient = check new (
    host = dbHost,
    user = dbUser,
    password = dbPassword,
    database = dbName,
    options = mysqlOptions
);
```

Key and certificate files must be provided in `.p12` (PKCS12) format.

## Step 4: Configure Connection Pooling (Optional)

The MySQL connector supports three connection pool modes:

### Global Default Pool

When no pool is specified, a globally-shared default pool is used:

```ballerina
// Uses the global default connection pool
mysql:Client dbClient = check new (
    host = "localhost",
    user = "root",
    password = "password"
);
```

### Client-Owned Pool

Define pool properties inline to create an unshared pool for a single client:

```ballerina
mysql:Client dbClient = check new (
    host = "localhost",
    user = "root",
    password = "password",
    database = "mydb",
    connectionPool = {
        maxOpenConnections: 10,
        maxConnectionLifeTime: 300,
        minIdleConnections: 5
    }
);
```

### Shared Pool Across Multiple Clients

Create a pool record and share it among multiple clients:

```ballerina
sql:ConnectionPool sharedPool = {
    maxOpenConnections: 20,
    maxConnectionLifeTime: 300,
    minIdleConnections: 5
};

mysql:Client readClient = check new (
    host = "read-replica.example.com",
    user = "reader",
    password = "pass",
    database = "mydb",
    connectionPool = sharedPool
);

mysql:Client writeClient = check new (
    host = "primary.example.com",
    user = "writer",
    password = "pass",
    database = "mydb",
    connectionPool = sharedPool
);
```

### Connection Pool Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `maxOpenConnections` | `int` | 15 | Maximum number of open connections |
| `maxConnectionLifeTime` | `decimal` | 1800 | Maximum lifetime of a connection (seconds) |
| `minIdleConnections` | `int` | 15 | Minimum number of idle connections |

## Step 5: Verify the Connection

Run your integration to verify the connection is working:

```bash
bal run
```

You can also add a simple verification query:

```ballerina
public function main() returns error? {
    mysql:Client dbClient = check new (
        host = dbHost,
        user = dbUser,
        password = dbPassword,
        database = dbName
    );

    // Verify connectivity
    _ = check dbClient->queryRow(`SELECT 1`);
    io:println("MySQL connection successful");

    check dbClient.close();
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Communications link failure` | Verify MySQL server is running and accessible on the specified host/port |
| `Access denied for user` | Check username and password in `Config.toml` |
| `Unknown database` | Ensure the database exists on the MySQL server |
| `SSL connection error` | Verify certificate file paths and passwords; check SSL mode compatibility |
| `Too many connections` | Reduce `maxOpenConnections` in the connection pool configuration |
| `No suitable driver found` | Ensure `import ballerinax/mysql.driver as _;` is present |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
