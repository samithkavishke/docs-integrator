---
sidebar_position: 10
title: Working with Ballerina Pro-Code
description: Write Ballerina code directly for advanced integration scenarios.
---

# Working with Ballerina Pro-Code

The WSO2 Integrator visual designer handles most integration scenarios. When you need more control -- custom types, concurrency, advanced logic, or third-party packages -- switch to pro-code and write Ballerina directly.

## When to Switch to Pro-Code

The visual designer is ideal for common patterns: HTTP services, connectors, data mapping, and simple control flow. Switch to pro-code when you need:

- **Custom record types** with constraints and validation logic
- **Complex transformations** beyond what the visual mapper supports
- **Concurrent execution** with workers and message passing
- **Third-party packages** from Ballerina Central
- **Custom error types** and fine-grained error handling
- **Utility functions** shared across multiple integrations

## Switching Between Views

WSO2 Integrator maintains bidirectional sync between the visual designer and the code editor. Changes in one view are reflected in the other.

To switch from the visual designer to code, click the **Source** tab in the VS Code editor. To return to the visual view, click the **Design** tab. Both views operate on the same `.bal` source file.

:::tip
You can make quick edits in the code view and immediately see them reflected in the visual designer. This is useful for tweaking generated code or adding annotations.
:::

## Writing Ballerina Code

### Module Structure

A Ballerina project consists of a root module and optional sub-modules.

```
my-integration/
  Ballerina.toml          # Project metadata and dependencies
  Config.toml             # Runtime configuration
  main.bal                # Root module source
  types.bal               # Type definitions
  utils.bal               # Utility functions
  modules/
    db/                   # Sub-module for database logic
      db.bal
    email/                # Sub-module for email logic
      email.bal
```

### Variable Declarations

```ballerina
// Immutable binding
final string API_VERSION = "v2";

// Module-level client (initialized once)
final http:Client apiClient = check new ("https://api.example.com");

// Configurable (overridden by Config.toml)
configurable string apiKey = ?;
```

### Functions

```ballerina
// Regular function with error return
function getCustomer(string id) returns Customer|error {
    return check dbClient->queryRow(`SELECT * FROM customers WHERE id = ${id}`);
}

// Isolated function (thread-safe, required for concurrency)
isolated function formatCurrency(decimal amount) returns string {
    return string `$${amount.round(2)}`;
}
```

## Custom Types and Records

Define records for type-safe data handling across your integration.

```ballerina
// Closed record (only declared fields allowed)
type OrderRequest record {|
    string customerId;
    OrderItem[] items;
    string shippingMethod;
    string? couponCode;    // Optional field
|};

type OrderItem record {|
    string sku;
    int quantity;
    decimal unitPrice;
|};

// Open record (additional fields allowed)
type ApiResponse record {
    int statusCode;
    string message;
    // Can contain additional undeclared fields
};

// Record with default values
type PaginationParams record {|
    int page = 1;
    int pageSize = 20;
    string sortBy = "createdAt";
    string sortOrder = "desc";
|};
```

### Type Constraints

Use Ballerina's constraint annotations for validation.

```ballerina
import ballerina/constraint;

type CreateUserRequest record {|
    @constraint:String {minLength: 1, maxLength: 100}
    string name;
    @constraint:String {pattern: re `^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`}
    string email;
    @constraint:Int {minValue: 18, maxValue: 150}
    int age;
|};
```

## Concurrency with Workers

Workers provide structured concurrency for parallel execution.

```ballerina
function fetchDashboardData(string userId) returns DashboardData|error {
    worker profileWorker returns UserProfile|error {
        return getUserProfile(userId);
    }

    worker ordersWorker returns Order[]|error {
        return getRecentOrders(userId);
    }

    worker notificationsWorker returns Notification[]|error {
        return getUnreadNotifications(userId);
    }

    UserProfile profile = check wait profileWorker;
    Order[] orders = check wait ordersWorker;
    Notification[] notifications = check wait notificationsWorker;

    return {profile, orders, notifications};
}
```

## Using the Ballerina Standard Library

Key packages available for integration development:

| Package | Purpose |
|---|---|
| `ballerina/http` | HTTP client and server |
| `ballerina/log` | Structured logging |
| `ballerina/io` | File I/O operations |
| `ballerina/time` | Date and time handling |
| `ballerina/regex` | Regular expressions |
| `ballerina/crypto` | Hashing and encryption |
| `ballerina/url` | URL encoding/decoding |
| `ballerina/uuid` | UUID generation |
| `ballerina/cache` | In-memory caching |
| `ballerina/constraint` | Data validation |
| `ballerina/data.csv` | CSV parsing |
| `ballerina/data.xmldata` | XML data binding |

## Importing Packages from Ballerina Central

Add third-party packages from [Ballerina Central](https://central.ballerina.io/) to your project.

### Adding a Dependency

Update `Ballerina.toml` to add a package dependency:

```toml
[[dependency]]
org = "ballerinax"
name = "mysql"
version = "1.13.0"
```

Or use the `bal` CLI:

```bash
bal add ballerinax/mysql
```

Then import and use the package in your code:

```ballerina
import ballerinax/mysql;
import ballerina/sql;

configurable string dbHost = "localhost";
configurable string dbUser = "root";
configurable string dbPassword = ?;

final mysql:Client dbClient = check new (
    host = dbHost, user = dbUser, password = dbPassword, database = "mydb"
);

function getUsers() returns User[]|error {
    stream<User, sql:Error?> userStream = dbClient->query(`SELECT * FROM users`);
    return from User user in userStream select user;
}
```

### Common Connector Packages

| Package | Connector |
|---|---|
| `ballerinax/mysql` | MySQL / MariaDB |
| `ballerinax/postgresql` | PostgreSQL |
| `ballerinax/kafka` | Apache Kafka |
| `ballerinax/rabbitmq` | RabbitMQ |
| `ballerinax/nats` | NATS |
| `ballerinax/redis` | Redis |
| `ballerinax/salesforce` | Salesforce |
| `ballerinax/googleapis.sheets` | Google Sheets |
| `ballerinax/ai.agent` | AI Agent framework |

## What's Next

- [Configuration Management](configuration-management.md) -- Manage environment-specific settings
- [Control Flow](control-flow.md) -- Conditional logic and parallel execution
