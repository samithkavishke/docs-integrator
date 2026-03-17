---
title: "Oracle Database - Setup"
description: "How to set up and configure the ballerinax/oracledb connector."
---

# Oracle Database Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running Oracle Database instance (12c+)

## Step 1: Add Dependencies

### Import the OracleDB Package

```ballerina
import ballerinax/oracledb;
import ballerinax/oracledb.driver as _;
import ballerina/sql;
```

The `oracledb.driver` import bundles the required Oracle JDBC driver JARs automatically.

### Alternative: Use Specific Driver Versions

```toml
[[platform.java17.dependency]]
groupId = "com.oracle.database.jdbc"
artifactId = "ojdbc11"
version = "23.3.0.23.09"

[[platform.java17.dependency]]
groupId = "com.oracle.database.xml"
artifactId = "xdb"
version = "21.1.0.0"

[[platform.java17.dependency]]
groupId = "com.oracle.database.xml"
artifactId = "xmlparserv2"
version = "12.2.0.1"
```

## Step 2: Configure the Connection

### Using Configurable Variables (Recommended)

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 1521;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

oracledb:Client dbClient = check new (
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
dbPort = 1521
dbUser = "admin"
dbPassword = "oracle123"
dbName = "ORCLCDB.localdomain"
```

### Client Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Database server hostname |
| `port` | `int` | `1521` | Database listener port |
| `user` | `string` | `""` | Username for authentication |
| `password` | `string` | `""` | Password for authentication |
| `database` | `string` | `""` | Service name or SID |
| `options` | `oracledb:Options?` | `()` | Oracle-specific options |
| `connectionPool` | `sql:ConnectionPool?` | `()` | Connection pool configuration |

## Step 3: Configure SSL (Optional)

```ballerina
oracledb:Options oracleOptions = {
    ssl: {
        key: {
            path: "/path/to/client-keystore.p12",
            password: "keystorePassword"
        },
        cert: {
            path: "/path/to/truststore.p12",
            password: "truststorePassword"
        }
    },
    loginTimeout: 5,
    autoCommit: true,
    connectTimeout: 30,
    socketTimeout: 30
};

oracledb:Client dbClient = check new (
    host = dbHost,
    user = dbUser,
    password = dbPassword,
    database = dbName,
    options = oracleOptions
);
```

## Step 4: Configure Connection Pooling (Optional)

```ballerina
sql:ConnectionPool pool = {
    maxOpenConnections: 15,
    maxConnectionLifeTime: 1800,
    minIdleConnections: 5
};

oracledb:Client dbClient = check new (
    host = dbHost,
    user = dbUser,
    password = dbPassword,
    database = dbName,
    connectionPool = pool
);
```

## Step 5: Verify the Connection

```ballerina
public function main() returns error? {
    oracledb:Client dbClient = check new (
        host = dbHost, user = dbUser,
        password = dbPassword, database = dbName
    );

    string banner = check dbClient->queryRow(
        `SELECT banner FROM v$version WHERE ROWNUM = 1`
    );
    io:println("Oracle version: ", banner);

    check dbClient.close();
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ORA-12541: TNS:no listener` | Verify Oracle listener is running on the configured port |
| `ORA-01017: invalid username/password` | Check credentials in `Config.toml` |
| `ORA-12514: TNS:listener does not know of service` | Verify the service name/SID |
| `SSL handshake error` | Check certificate paths and Oracle wallet configuration |
| `No suitable driver found` | Ensure `import ballerinax/oracledb.driver as _;` is present |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
