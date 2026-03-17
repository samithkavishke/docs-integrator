---
title: Connection Configuration
description: Create and manage connections to external systems in WSO2 Integrator.
---

# Connection Configuration

Connections define how your integration communicates with external systems — the endpoint URL, credentials, timeouts, and pool settings. You can create connections visually in the designer or directly in code.

## Creating a Connection in the Visual Designer

1. Open your integration project in VS Code.
2. In the **Project Explorer** (left sidebar), expand **Connections**.
3. Click **+ Add Connection**.
4. Select the connector type (e.g., HTTP, MySQL, Salesforce).
5. Fill in the connection parameters (host, credentials, etc.).
6. Click **Save** — the connection is now available across all artifacts in the project.

The designer generates the corresponding Ballerina code:

```ballerina
// Auto-generated connection
configurable string mysqlHost = ?;
configurable string mysqlUser = ?;
configurable string mysqlPassword = ?;

final mysql:Client orderDb = check new (
    host = mysqlHost,
    user = mysqlUser,
    password = mysqlPassword,
    database = "orders",
    port = 3306
);
```

## Creating a Connection in Code

Define the client as a module-level variable with `final`:

```ballerina
import ballerina/http;

// HTTP client with retry and timeout
final http:Client apiClient = check new ("https://api.example.com", {
    timeout: 30,
    retryConfig: {
        count: 3,
        interval: 2,
        backOffFactor: 2.0,
        maxWaitInterval: 30
    }
});
```

## Configurable Parameters

Use `configurable` variables to externalize connection parameters so they vary by environment:

```ballerina
// Defined in code
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbUser = ?;        // Required — must be in Config.toml
configurable string dbPassword = ?;     // Required

// Provided in Config.toml
// [dev]
// dbHost = "localhost"
// dbUser = "root"
// dbPassword = "devpass"
```

### Config.toml Example

```toml
dbHost = "db.production.example.com"
dbPort = 3306
dbUser = "app_user"
dbPassword = "s3cur3-p@ss"
```

## Connection Pooling

All database and HTTP connectors support connection pooling:

```ballerina
// Database connection pool
final mysql:Client db = check new (
    host = dbHost, user = dbUser, password = dbPassword,
    database = "mydb",
    connectionPool = {
        maxOpenConnections: 25,       // Max concurrent connections
        maxConnectionLifeTime: 1800,  // 30 minutes max lifetime
        minIdleConnections: 5         // Keep 5 idle connections ready
    }
);

// HTTP connection pool
final http:Client api = check new ("https://api.example.com", {
    poolConfig: {
        maxActiveConnections: 20,
        maxIdleConnections: 10,
        waitTime: 30,
        maxActiveStreamsPerConnection: 100
    }
});
```

## Timeout Configuration

```ballerina
// HTTP timeouts
final http:Client api = check new ("https://api.example.com", {
    timeout: 30                    // Response timeout in seconds
});

// Database timeouts
final mysql:Client db = check new (
    host = "localhost", user = "root", password = "pass",
    database = "mydb",
    options = {
        connectTimeout: 10,        // Connection timeout in seconds
        socketTimeout: 30          // Socket read/write timeout
    }
);
```

## Using Connections in Flows

Once defined, connections appear in the visual designer's connection dropdown when you add action nodes:

1. Add a **Call Endpoint** or **Database Query** node.
2. Select the connection from the dropdown.
3. Configure the operation (method, path, query, etc.).
4. The designer auto-generates the client invocation code.

## Sharing Connections Across Modules

Connections defined at the module level are accessible to all functions and resources in that module. To share across modules, define the connection in a shared module:

```
my-integration/
├── modules/
│   └── connections/
│       └── db.bal          # Shared database connections
│       └── apis.bal        # Shared API clients
├── service.bal             # Uses connections.db, connections.apis
└── automation.bal          # Uses connections.db
```

```ballerina
// modules/connections/db.bal
public final mysql:Client orderDb = check new (...);
```

```ballerina
// service.bal
import my_integration.connections;

resource function get orders() returns Order[]|error {
    return connections:orderDb->query(`SELECT * FROM orders`);
}
```

## What's Next

- [Authentication Methods](authentication.md) — Secure your connections with OAuth, API keys, and mTLS
- [Error Handling per Connector](error-handling.md) — Handle connection and operation failures
