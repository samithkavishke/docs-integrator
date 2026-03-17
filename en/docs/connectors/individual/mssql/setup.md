---
title: "Microsoft SQL Server - Setup"
description: "How to set up and configure the ballerinax/mssql connector."
---

# Microsoft SQL Server Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running Microsoft SQL Server instance (2016+)

## Step 1: Add Dependencies

### Import the MSSQL Package

```ballerina
import ballerinax/mssql;
import ballerinax/mssql.driver as _;
import ballerina/sql;
```

The `mssql.driver` import bundles the latest Microsoft JDBC driver JAR automatically.

### Alternative: Use a Specific Driver Version

```toml
[[platform.java21.dependency]]
groupId = "com.microsoft.sqlserver"
artifactId = "mssql-jdbc"
version = "12.8.1.jre11"
```

## Step 2: Configure the Connection

### Using Configurable Variables (Recommended)

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 1433;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

mssql:Client dbClient = check new (
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
dbPort = 1433
dbUser = "sa"
dbPassword = "YourStrong@Password"
dbName = "inventory_db"
```

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Microsoft SQL Server**
4. Enter connection details (host, port, user, password, database)

### Client Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Database server hostname |
| `port` | `int` | `1433` | Database server port |
| `user` | `string` | `""` | Username for authentication |
| `password` | `string` | `""` | Password for authentication |
| `database` | `string` | `""` | Database name |
| `instance` | `string?` | `()` | Named instance of SQL Server |
| `options` | `mssql:Options?` | `()` | MSSQL-specific options |
| `connectionPool` | `sql:ConnectionPool?` | `()` | Connection pool configuration |

## Step 3: Configure SSL/TLS (Optional)

### SSL Configuration

```ballerina
mssql:Options mssqlOptions = {
    secureSocket: {
        encrypt: true,
        trustServerCertificate: false,
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePassword"
        },
        key: {
            path: "/path/to/client-keystore.p12",
            password: "keystorePassword"
        }
    },
    loginTimeout: 10
};

mssql:Client dbClient = check new (
    host = dbHost,
    user = dbUser,
    password = dbPassword,
    database = dbName,
    options = mssqlOptions
);
```

For local development and testing, you can set `trustServerCertificate` to `true` to skip certificate verification:

```ballerina
mssql:Options devOptions = {
    secureSocket: {
        encrypt: true,
        trustServerCertificate: true
    }
};
```

## Step 4: Configure Connection Pooling (Optional)

```ballerina
sql:ConnectionPool pool = {
    maxOpenConnections: 15,
    maxConnectionLifeTime: 1800,
    minIdleConnections: 5
};

mssql:Client dbClient = check new (
    host = dbHost,
    user = dbUser,
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
    mssql:Client dbClient = check new (
        host = dbHost, user = dbUser,
        password = dbPassword, database = dbName
    );

    string version = check dbClient->queryRow(
        `SELECT @@VERSION AS version`
    );
    io:println("SQL Server version: ", version);

    check dbClient.close();
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Login failed for user` | Verify username and password; ensure SQL authentication is enabled |
| `Cannot open server` | Check that SQL Server is running and accessible on the configured host/port |
| `The TCP/IP connection failed` | Enable TCP/IP protocol in SQL Server Configuration Manager |
| `SSL connection error` | Set `trustServerCertificate: true` for self-signed certs or provide correct certificate |
| `No suitable driver found` | Ensure `import ballerinax/mssql.driver as _;` is present |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
