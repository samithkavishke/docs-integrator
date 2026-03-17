---
title: "JDBC (Generic) - Examples"
description: "Code examples for the ballerinax/java.jdbc connector."
---

# JDBC (Generic) Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/java.jdbc;

configurable string jdbcUrl = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;
```

## Example 1: H2 Embedded Database

Use H2 as an in-process embedded database for lightweight applications:

```toml
# Ballerina.toml
[[platform.java17.dependency]]
groupId = "com.h2database"
artifactId = "h2"
version = "2.2.224"
```

```toml
# Config.toml
jdbcUrl = "jdbc:h2:./data/myapp"
dbUser = "sa"
dbPassword = ""
```

```ballerina
type Task record {|
    int id;
    string title;
    string status;
    string created_at;
|};

public function main() returns error? {
    jdbc:Client dbClient = check new (
        url = jdbcUrl, user = dbUser, password = dbPassword
    );

    // Create table
    _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Insert
    _ = check dbClient->execute(
        `INSERT INTO tasks (title) VALUES (${"Build integration"})`
    );
    _ = check dbClient->execute(
        `INSERT INTO tasks (title) VALUES (${"Write tests"})`
    );

    // Query
    stream<Task, sql:Error?> taskStream = dbClient->query(
        `SELECT * FROM tasks ORDER BY created_at DESC`
    );
    check from Task t in taskStream
        do {
            io:println(string `[${t.status}] ${t.title}`);
        };

    check dbClient.close();
}
```

## Example 2: SQLite Database

```toml
# Ballerina.toml
[[platform.java17.dependency]]
groupId = "org.xerial"
artifactId = "sqlite-jdbc"
version = "3.45.1.0"
```

```toml
# Config.toml
jdbcUrl = "jdbc:sqlite:./data/notes.db"
dbUser = ""
dbPassword = ""
```

```ballerina
type Note record {|
    int id;
    string title;
    string content;
|};

public function main() returns error? {
    jdbc:Client dbClient = check new (url = jdbcUrl);

    _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT
        )
    `);

    _ = check dbClient->execute(
        `INSERT INTO notes (title, content)
         VALUES (${"Meeting Notes"}, ${"Discussed Q1 priorities"})`
    );

    stream<Note, sql:Error?> noteStream = dbClient->query(
        `SELECT * FROM notes`
    );
    check from Note n in noteStream
        do {
            io:println(string `${n.title}: ${n.content}`);
        };

    check dbClient.close();
}
```

## Example 3: MariaDB Connection

```toml
# Ballerina.toml
[[platform.java17.dependency]]
groupId = "org.mariadb.jdbc"
artifactId = "mariadb-java-client"
version = "3.3.2"
```

```toml
# Config.toml
jdbcUrl = "jdbc:mariadb://localhost:3306/mydb"
dbUser = "root"
dbPassword = "password"
```

```ballerina
type Customer record {|
    int id;
    string name;
    string email;
|};

public function main() returns error? {
    jdbc:Client dbClient = check new (
        url = jdbcUrl, user = dbUser, password = dbPassword
    );

    stream<Customer, sql:Error?> customers = dbClient->query(
        `SELECT id, name, email FROM customers ORDER BY name`
    );
    check from Customer c in customers
        do {
            io:println(c.name, " - ", c.email);
        };

    check dbClient.close();
}
```

## Example 4: REST API with Generic JDBC

```ballerina
type Item record {|
    int id;
    string name;
    string category;
    decimal price;
|};

type ItemInput record {|
    string name;
    string category;
    decimal price;
|};

final jdbc:Client dbClient = check new (
    url = jdbcUrl, user = dbUser, password = dbPassword
);

service /api on new http:Listener(8080) {

    resource function get items() returns Item[]|error {
        stream<Item, sql:Error?> itemStream = dbClient->query(
            `SELECT * FROM items ORDER BY name`
        );
        return from Item i in itemStream select i;
    }

    resource function get items/[int id]() returns Item|http:NotFound|error {
        Item|sql:Error result = dbClient->queryRow(
            `SELECT * FROM items WHERE id = ${id}`
        );
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        }
        return result;
    }

    resource function post items(ItemInput input)
            returns record {|int id;|}|error {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO items (name, category, price)
             VALUES (${input.name}, ${input.category}, ${input.price})`
        );
        return {id: <int>result.lastInsertId};
    }
}
```

## Example 5: Transactions

```ballerina
function atomicTransfer(jdbc:Client dbClient,
                         int fromId, int toId,
                         decimal amount) returns error? {
    transaction {
        sql:ExecutionResult debit = check dbClient->execute(
            `UPDATE accounts SET balance = balance - ${amount}
             WHERE id = ${fromId} AND balance >= ${amount}`
        );

        if debit.affectedRowCount == 0 {
            return error("Insufficient balance");
        }

        _ = check dbClient->execute(
            `UPDATE accounts SET balance = balance + ${amount}
             WHERE id = ${toId}`
        );

        _ = check dbClient->execute(
            `INSERT INTO transfers (from_account, to_account, amount)
             VALUES (${fromId}, ${toId}, ${amount})`
        );

        check commit;
    }
}
```

## Example 6: Batch Operations

```ballerina
type LogEntry record {|
    string level;
    string message;
    string source;
|};

function batchInsertLogs(jdbc:Client dbClient,
                          LogEntry[] entries) returns error? {
    sql:ParameterizedQuery[] queries = from var e in entries
        select `INSERT INTO app_log (level, message, source)
                VALUES (${e.level}, ${e.message}, ${e.source})`;

    sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
    io:println(string `Inserted ${results.length()} log entries`);
}
```

## Example 7: Connection Pool Configuration

```ballerina
jdbc:Client dbClient = check new (
    url = jdbcUrl,
    user = dbUser,
    password = dbPassword,
    options = {
        datasourceName: "org.h2.jdbcx.JdbcDataSource",
        properties: {"loginTimeout": "5000"}
    },
    connectionPool = {
        maxOpenConnections: 20,
        maxConnectionLifeTime: 1800,
        minIdleConnections: 5
    }
);
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
