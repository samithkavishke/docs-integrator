---
title: "JDBC (Generic) - Setup"
description: "How to set up and configure the ballerinax/java.jdbc connector."
---

# JDBC (Generic) Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- JDBC driver JAR for your target database

## Step 1: Add Dependencies

### Import the JDBC Package

```ballerina
import ballerinax/java.jdbc;
import ballerina/sql;
```

### Add the Database Driver

Unlike database-specific connectors, the generic JDBC connector requires you to provide the JDBC driver manually in `Ballerina.toml`.

**H2 Database:**

```toml
[[platform.java17.dependency]]
groupId = "com.h2database"
artifactId = "h2"
version = "2.2.224"
```

**SQLite:**

```toml
[[platform.java17.dependency]]
groupId = "org.xerial"
artifactId = "sqlite-jdbc"
version = "3.45.1.0"
```

**MariaDB:**

```toml
[[platform.java17.dependency]]
groupId = "org.mariadb.jdbc"
artifactId = "mariadb-java-client"
version = "3.3.2"
```

**CockroachDB (uses PostgreSQL driver):**

```toml
[[platform.java17.dependency]]
groupId = "org.postgresql"
artifactId = "postgresql"
version = "42.7.3"
```

**Using a local JAR file:**

```toml
[[platform.java17.dependency]]
path = "./libs/my-database-driver.jar"
```

## Step 2: Configure the Connection

### Basic Connection with JDBC URL

The JDBC URL is the primary connection parameter and follows a database-specific format.

```ballerina
configurable string jdbcUrl = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

jdbc:Client dbClient = check new (
    url = jdbcUrl,
    user = dbUser,
    password = dbPassword
);
```

### Common JDBC URL Formats

| Database | JDBC URL Format |
|----------|----------------|
| H2 (file) | `jdbc:h2:~/path/to/database` |
| H2 (memory) | `jdbc:h2:mem:testdb` |
| H2 (server) | `jdbc:h2:tcp://localhost/~/test` |
| SQLite | `jdbc:sqlite:/path/to/database.db` |
| MariaDB | `jdbc:mariadb://host:3306/dbname` |
| CockroachDB | `jdbc:postgresql://host:26257/dbname?sslmode=verify-full` |

```toml
# Config.toml
# H2 embedded database
jdbcUrl = "jdbc:h2:~/myapp"
dbUser = "sa"
dbPassword = ""

# SQLite
# jdbcUrl = "jdbc:sqlite:/data/myapp.db"
# dbUser = ""
# dbPassword = ""

# MariaDB
# jdbcUrl = "jdbc:mariadb://localhost:3306/mydb"
# dbUser = "root"
# dbPassword = "password"
```

### With Custom DataSource

```ballerina
jdbc:Client dbClient = check new (
    url = "jdbc:h2:~/path/to/database",
    user = "root",
    password = "root",
    options = {
        datasourceName: "org.h2.jdbcx.JdbcDataSource",
        properties: {"loginTimeout": "2000"}
    }
);
```

### With Connection Pool

```ballerina
jdbc:Client dbClient = check new (
    url = jdbcUrl,
    user = dbUser,
    password = dbPassword,
    connectionPool = {
        maxOpenConnections: 10,
        maxConnectionLifeTime: 1800,
        minIdleConnections: 3
    }
);
```

## Step 3: Verify the Connection

```ballerina
import ballerinax/java.jdbc;
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

    _ = check dbClient->queryRow(`SELECT 1`);
    io:println("JDBC connection successful");

    check dbClient.close();
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `No suitable driver found` | Add the correct JDBC driver dependency to `Ballerina.toml` |
| `Connection refused` | Verify the database server is running and the JDBC URL is correct |
| `Authentication failed` | Check username and password |
| `ClassNotFoundException` | The JDBC driver JAR is missing; verify the dependency configuration |
| `Unsupported protocol` | Verify the JDBC URL prefix matches the driver |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
