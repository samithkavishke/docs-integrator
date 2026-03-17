---
title: "MySQL - Actions"
description: "Available actions and operations for the ballerinax/mysql connector."
---

# MySQL Actions

The `ballerinax/mysql` connector extends the `sql:Client` interface, providing five core database operations. All operations use parameterized queries for SQL injection prevention.

## Client Initialization

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final mysql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    user = dbUser,
    password = dbPassword,
    database = dbName
);
```

## query()

Executes a SELECT query and returns results as a stream. Use this for queries that return multiple rows.

**Signature:**
```ballerina
stream<record {}, sql:Error?> query(sql:ParameterizedQuery sqlQuery, typedesc<record {}> rowType = <>)
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | The parameterized SQL query |
| `rowType` | `typedesc<record {}>` | The expected record type for result mapping |

**Example -- Query with record mapping:**

```ballerina
type Customer record {|
    int id;
    string name;
    string email;
    decimal balance;
|};

stream<Customer, sql:Error?> customerStream =
    dbClient->query(`SELECT id, name, email, balance FROM customers`);

check from Customer customer in customerStream
    do {
        io:println(customer);
    };
```

**Example -- Query with parameters:**

```ballerina
int minBalance = 1000;
stream<Customer, sql:Error?> customerStream =
    dbClient->query(`SELECT id, name, email, balance
                     FROM customers
                     WHERE balance > ${minBalance}`);
```

**Example -- Query returning open record:**

```ballerina
stream<record {}, sql:Error?> resultStream =
    dbClient->query(`SELECT * FROM customers`);
```

## queryRow()

Executes a SELECT query and returns exactly one row. Returns an error if the query returns zero or more than one row.

**Signature:**
```ballerina
record {}|error queryRow(sql:ParameterizedQuery sqlQuery, typedesc<record {}> rowType = <>)
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | The parameterized SQL query |
| `rowType` | `typedesc<record {}>` | The expected record type for result mapping |

**Example -- Get a single record:**

```ballerina
type Customer record {|
    int id;
    string name;
    string email;
|};

int customerId = 42;
Customer customer = check dbClient->queryRow(
    `SELECT id, name, email FROM customers WHERE id = ${customerId}`
);
io:println("Customer: ", customer.name);
```

**Example -- Get a scalar value:**

```ballerina
int count = check dbClient->queryRow(
    `SELECT COUNT(*) as count FROM customers`
);
io:println("Total customers: ", count);
```

## execute()

Executes an INSERT, UPDATE, DELETE, or DDL statement and returns the execution result.

**Signature:**
```ballerina
sql:ExecutionResult|sql:Error execute(sql:ParameterizedQuery sqlQuery)
```

**Return type -- `sql:ExecutionResult`:**
| Field | Type | Description |
|-------|------|-------------|
| `affectedRowCount` | `int` | Number of rows affected |
| `lastInsertId` | `string\|int?` | The auto-generated ID for INSERT operations |

**Example -- Insert a row:**

```ballerina
string name = "Alice";
string email = "alice@example.com";
decimal balance = 5000.00;

sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO customers (name, email, balance)
     VALUES (${name}, ${email}, ${balance})`
);
io:println("Inserted row ID: ", result.lastInsertId);
```

**Example -- Update rows:**

```ballerina
int customerId = 42;
string newEmail = "alice.new@example.com";

sql:ExecutionResult result = check dbClient->execute(
    `UPDATE customers SET email = ${newEmail} WHERE id = ${customerId}`
);
io:println("Updated rows: ", result.affectedRowCount);
```

**Example -- Delete rows:**

```ballerina
int customerId = 42;

sql:ExecutionResult result = check dbClient->execute(
    `DELETE FROM customers WHERE id = ${customerId}`
);
io:println("Deleted rows: ", result.affectedRowCount);
```

**Example -- DDL statement:**

```ballerina
_ = check dbClient->execute(`
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        balance DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
```

## batchExecute()

Executes a batch of parameterized DML statements. All statements in the batch must use the same SQL template with different parameter values.

**Signature:**
```ballerina
sql:ExecutionResult[]|sql:Error batchExecute(sql:ParameterizedQuery[] sqlQueries)
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `sqlQueries` | `sql:ParameterizedQuery[]` | Array of parameterized queries |

**Example -- Batch insert:**

```ballerina
type CustomerInput record {|
    string name;
    string email;
    decimal balance;
|};

CustomerInput[] customers = [
    {name: "Alice", email: "alice@example.com", balance: 1000.00},
    {name: "Bob", email: "bob@example.com", balance: 2500.00},
    {name: "Charlie", email: "charlie@example.com", balance: 750.00}
];

sql:ParameterizedQuery[] insertQueries = from var c in customers
    select `INSERT INTO customers (name, email, balance)
            VALUES (${c.name}, ${c.email}, ${c.balance})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(insertQueries);

foreach sql:ExecutionResult result in results {
    io:println("Inserted ID: ", result.lastInsertId);
}
```

## call()

Executes a stored procedure. Supports IN, OUT, and INOUT parameters, and can return multiple result sets.

**Signature:**
```ballerina
sql:ProcedureCallResult|sql:Error call(sql:ParameterizedCallQuery sqlQuery, typedesc<record {}>[] rowTypes = [])
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `sqlQuery` | `sql:ParameterizedCallQuery` | The parameterized stored procedure call |
| `rowTypes` | `typedesc<record {}>[]` | Expected record types for result sets |

**Return type -- `sql:ProcedureCallResult`:**
| Field | Type | Description |
|-------|------|-------------|
| `queryResult` | `stream<record {}, sql:Error?>?` | The first result set (if any) |
| `executionResult` | `sql:ExecutionResult?` | Execution metadata |

**Example -- Call with IN parameters:**

```ballerina
int customerId = 42;
sql:ProcedureCallResult result = check dbClient->call(
    `CALL GetCustomerOrders(${customerId})`
);

// Process the result set
stream<record {}, sql:Error?>? resultStream = result.queryResult;
if resultStream is stream<record {}, sql:Error?> {
    check from var row in resultStream
        do {
            io:println(row);
        };
}
check result.close();
```

**Example -- Call with OUT parameters:**

```ballerina
sql:IntegerOutParameter totalOrders = new;

sql:ProcedureCallResult result = check dbClient->call(
    `CALL CountCustomerOrders(${customerId}, ${totalOrders})`
);
io:println("Total orders: ", totalOrders.get(int));
check result.close();
```

**Example -- Call with INOUT parameters:**

```ballerina
sql:InOutParameter discountRate = new (15.0);

sql:ProcedureCallResult result = check dbClient->call(
    `CALL CalculateDiscount(${customerId}, ${discountRate})`
);
io:println("Final discount: ", discountRate.get(decimal));
check result.close();
```

## Error Handling

All operations return `sql:Error` on failure. Use `check` to propagate errors or handle them explicitly:

```ballerina
// Pattern 1: Propagate with check
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO customers (name) VALUES (${"Alice"})`
);

// Pattern 2: Handle explicitly
sql:ExecutionResult|sql:Error result = dbClient->execute(
    `INSERT INTO customers (name) VALUES (${"Alice"})`
);
if result is sql:Error {
    io:println("Database error: ", result.message());
    // Handle specific error codes
    if result is sql:DatabaseError {
        int? errorCode = result.detail().errorCode;
        io:println("Error code: ", errorCode);
    }
}

// Pattern 3: do/on fail block
do {
    _ = check dbClient->execute(
        `INSERT INTO customers (name) VALUES (${"Alice"})`
    );
} on fail error e {
    io:println("Operation failed: ", e.message());
}
```

## Client Lifecycle

The client should be created once and reused throughout the application. Always close the client when done:

```ballerina
public function main() returns error? {
    mysql:Client dbClient = check new (...);

    // Use the client for all operations
    // ...

    // Close when the application shuts down
    check dbClient.close();
}
```

For HTTP services, declare the client as a module-level variable:

```ballerina
final mysql:Client dbClient = check new (...);

service /api on new http:Listener(8080) {
    resource function get customers() returns Customer[]|error {
        // The client is shared across all requests
        stream<Customer, sql:Error?> customerStream =
            dbClient->query(`SELECT * FROM customers`);
        return from Customer c in customerStream select c;
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
