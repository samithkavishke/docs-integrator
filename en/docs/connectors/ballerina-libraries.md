---
title: Using Ballerina Libraries
description: Import and use third-party Ballerina packages from Ballerina Central.
---

# Using Ballerina Libraries

Extend your integrations with packages from [Ballerina Central](https://central.ballerina.io) — the package registry for the Ballerina ecosystem. Any published Ballerina package can be used directly in your WSO2 Integrator projects.

## Finding Packages

### Search on Ballerina Central

Browse [central.ballerina.io](https://central.ballerina.io) to discover packages by category:

- **ballerina/** — Core standard library (HTTP, SQL, IO, crypto, etc.)
- **ballerinax/** — Extended connectors (Salesforce, Kafka, OpenAI, etc.)
- **community/** — Community-contributed packages

### Search from the CLI

```bash
# Search by keyword
bal search kafka

# Search for a specific organization
bal search salesforce --org ballerinax
```

### Search from VS Code

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type **Ballerina: Pull Module**.
3. Search for the package name.

## Adding a Dependency

### Method 1: Import and Auto-Resolve

Add an `import` statement in your `.bal` file — the extension pulls the package automatically on build:

```ballerina
import ballerinax/mysql;
import ballerinax/kafka;
import ballerinax/salesforce;
```

### Method 2: CLI

```bash
# Add a specific package
bal add ballerinax/mysql

# Add a specific version
bal add ballerinax/mysql:1.16.2
```

### Method 3: Edit Ballerina.toml

```toml
[[dependency]]
org = "ballerinax"
name = "mysql"
version = "1.16.2"
```

## Using a Package

Once imported, use the package types and functions:

```ballerina
import ballerinax/mysql;
import ballerina/sql;

// Create a client
final mysql:Client db = check new (
    host = "localhost", user = "root", password = "pass",
    database = "mydb"
);

// Use package types
type Employee record {|
    int id;
    string name;
    decimal salary;
|};

// Use package operations
stream<Employee, sql:Error?> employees = db->query(
    `SELECT * FROM employees`
);
```

## Standard Library Packages

Key packages from the Ballerina standard library:

| Package | Purpose |
|---------|---------|
| `ballerina/http` | HTTP client and service |
| `ballerina/sql` | Base SQL abstractions |
| `ballerina/io` | File I/O operations |
| `ballerina/log` | Logging |
| `ballerina/time` | Date and time |
| `ballerina/crypto` | Encryption, hashing, signing |
| `ballerina/regex` | Regular expressions |
| `ballerina/cache` | In-memory caching |
| `ballerina/task` | Scheduled tasks |
| `ballerina/uuid` | UUID generation |
| `ballerina/url` | URL encoding/decoding |
| `ballerina/file` | File system operations |
| `ballerina/email` | SMTP, POP3, IMAP |
| `ballerina/graphql` | GraphQL client and service |
| `ballerina/grpc` | gRPC client and service |
| `ballerina/websocket` | WebSocket client and service |
| `ballerina/jwt` | JWT generation and validation |
| `ballerina/oauth2` | OAuth 2.0 client |

## Managing Dependencies

### View Current Dependencies

```bash
bal dependencies
```

### Update Dependencies

```bash
# Update all dependencies to latest compatible versions
bal dist update

# Pull the latest version of a specific package
bal pull ballerinax/mysql
```

### Lock File

The `Dependencies.toml` file locks exact versions. Commit this file to version control for reproducible builds.

## Java Interoperability

You can also use Java libraries directly in Ballerina:

```ballerina
import ballerina/jballerina.java;

function getSystemProperty(string key) returns string = @java:Method {
    name: "getProperty",
    'class: "java.lang.System"
} external;
```

## What's Next

- [Publish to Ballerina Central](publish-to-central.md) — Share your own packages
- [Custom Connector Development](custom-development.md) — Build custom connectors
- [Manage Dependencies](/docs/develop/organize-code/manage-dependencies) — Detailed dependency management
