---
title: "PostgreSQL - Setup"
description: "How to set up and configure the ballerinax/postgresql connector."
---

# PostgreSQL Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running PostgreSQL server (10+)

## Step 1: Add Dependencies

### Import the PostgreSQL Package

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;
import ballerina/sql;
```

The `postgresql.driver` import bundles the latest PostgreSQL JDBC driver JAR automatically.

### Alternative: Use a Specific Driver Version

```toml
[[platform.java17.dependency]]
groupId = "org.postgresql"
artifactId = "postgresql"
version = "42.7.3"
```

## Step 2: Configure the Connection

### Using Configurable Variables (Recommended)

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

postgresql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    username = dbUser,
    password = dbPassword,
    database = dbName
);
```

```toml
# Config.toml
dbHost = "localhost"
dbPort = 5432
dbUser = "postgres"
dbPassword = "postgres123"
dbName = "appdb"
```

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **PostgreSQL**
4. Enter connection details (host, port, username, password, database)

### Client Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Database server hostname |
| `port` | `int` | `5432` | Database server port |
| `username` | `string` | `"postgres"` | Username for authentication |
| `password` | `string` | `""` | Password for authentication |
| `database` | `string` | `"postgres"` | Database name |
| `options` | `postgresql:Options?` | `()` | PostgreSQL-specific options |
| `connectionPool` | `sql:ConnectionPool?` | `()` | Connection pool configuration |

## Step 3: Configure SSL (Optional)

### SSL Modes

| Mode | Description |
|------|-------------|
| `postgresql:DISABLE` | No SSL connection |
| `postgresql:ALLOW` | Use SSL if the server requests it |
| `postgresql:PREFERRED` | Use SSL if the server supports it |
| `postgresql:REQUIRED` | Always use SSL |
| `postgresql:VERIFY_CA` | SSL with server CA verification |
| `postgresql:VERIFY_IDENTITY` | SSL with full certificate and hostname verification |

### SSL Configuration

```ballerina
postgresql:Options pgOptions = {
    ssl: {
        mode: postgresql:VERIFY_CA,
        key: {
            path: "/path/to/client-keystore.p12",
            password: "keystorePassword"
        }
    },
    connectTimeout: 10
};

postgresql:Client dbClient = check new (
    host = dbHost,
    username = dbUser,
    password = dbPassword,
    database = dbName,
    options = pgOptions
);
```

## Step 4: Configure Connection Pooling (Optional)

```ballerina
sql:ConnectionPool pool = {
    maxOpenConnections: 20,
    maxConnectionLifeTime: 1800,
    minIdleConnections: 5
};

postgresql:Client dbClient = check new (
    host = dbHost,
    username = dbUser,
    password = dbPassword,
    database = dbName,
    connectionPool = pool
);
```

## Step 5: Verify the Connection

```bash
bal run
```

```ballerina
public function main() returns error? {
    postgresql:Client dbClient = check new (
        host = dbHost,
        username = dbUser,
        password = dbPassword,
        database = dbName
    );

    string version = check dbClient->queryRow(`SELECT version()`);
    io:println("PostgreSQL version: ", version);

    check dbClient.close();
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify PostgreSQL is running and accepting connections on the configured host/port |
| `FATAL: password authentication failed` | Check username and password in `Config.toml` |
| `FATAL: database does not exist` | Create the database or check the database name |
| `SSL connection error` | Verify certificate paths and that `pg_hba.conf` allows SSL connections |
| `No suitable driver found` | Ensure `import ballerinax/postgresql.driver as _;` is present |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
