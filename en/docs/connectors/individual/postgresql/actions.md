---
title: "PostgreSQL - Actions"
description: "Available actions and operations for the ballerinax/postgresql connector."
---

# PostgreSQL Actions

The `ballerinax/postgresql` connector extends the `sql:Client` interface with five core operations. All operations support parameterized queries for SQL injection prevention.

## Client Initialization

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final postgresql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    username = dbUser,
    password = dbPassword,
    database = dbName
);
```

## query()

Executes a SELECT query and returns results as a stream.

```ballerina
type Employee record {|
    int id;
    string first_name;
    string last_name;
    string department;
    decimal salary;
|};

// Basic query
stream<Employee, sql:Error?> empStream =
    dbClient->query(`SELECT * FROM employees`);

check from Employee emp in empStream
    do {
        io:println(emp.first_name, " ", emp.last_name);
    };

// Parameterized query
string dept = "Engineering";
decimal minSalary = 80000.00;
stream<Employee, sql:Error?> filteredStream =
    dbClient->query(`SELECT * FROM employees
                     WHERE department = ${dept}
                     AND salary >= ${minSalary}
                     ORDER BY salary DESC`);
```

## queryRow()

Returns a single row from the query result.

```ballerina
// Get a single record
int empId = 42;
Employee emp = check dbClient->queryRow(
    `SELECT * FROM employees WHERE id = ${empId}`
);

// Get a scalar value
int count = check dbClient->queryRow(
    `SELECT COUNT(*) FROM employees WHERE department = ${"Engineering"}`
);
```

## execute()

Executes INSERT, UPDATE, DELETE, or DDL statements.

```ballerina
// Insert
string name = "Alice";
string email = "alice@example.com";
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO users (name, email) VALUES (${name}, ${email})`
);
io:println("Inserted ID: ", result.lastInsertId);

// Update
sql:ExecutionResult updateResult = check dbClient->execute(
    `UPDATE users SET email = ${"alice.new@example.com"} WHERE id = ${1}`
);
io:println("Updated rows: ", updateResult.affectedRowCount);

// Delete
sql:ExecutionResult deleteResult = check dbClient->execute(
    `DELETE FROM users WHERE id = ${1}`
);

// DDL
_ = check dbClient->execute(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);
```

## batchExecute()

Executes a batch of parameterized DML statements.

```ballerina
type UserInput record {|
    string name;
    string email;
|};

UserInput[] users = [
    {name: "Alice", email: "alice@example.com"},
    {name: "Bob", email: "bob@example.com"},
    {name: "Carol", email: "carol@example.com"}
];

sql:ParameterizedQuery[] insertQueries = from var u in users
    select `INSERT INTO users (name, email) VALUES (${u.name}, ${u.email})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(insertQueries);
```

## call()

Executes stored procedures and functions.

```ballerina
// Call with IN parameters
sql:ProcedureCallResult result = check dbClient->call(
    `CALL update_user_status(${42}, ${"active"})`
);
check result.close();

// Call with OUT parameters
sql:IntegerOutParameter totalCount = new;
sql:ProcedureCallResult result2 = check dbClient->call(
    `CALL count_active_users(${totalCount})`
);
io:println("Active users: ", totalCount.get(int));
check result2.close();

// Call with result set
type UserRecord record {|
    int id;
    string name;
    string email;
|};

sql:ProcedureCallResult result3 = check dbClient->call(
    `CALL get_users_by_dept(${"Engineering"})`,
    [UserRecord]
);

stream<record {}, sql:Error?>? resultStream = result3.queryResult;
if resultStream is stream<record {}, sql:Error?> {
    check from var row in resultStream
        do {
            io:println(row);
        };
}
check result3.close();
```

## Error Handling

```ballerina
do {
    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO users (name, email) VALUES (${"Alice"}, ${"alice@example.com"})`
    );
} on fail error e {
    if e is sql:DatabaseError {
        int? errorCode = e.detail().errorCode;
        string? sqlState = e.detail().sqlState;
        // PostgreSQL error code 23505 = unique_violation
        if sqlState == "23505" {
            io:println("Duplicate entry detected");
        }
    }
    io:println("Database error: ", e.message());
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
