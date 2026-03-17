---
title: "Microsoft SQL Server - Actions"
description: "Available actions and operations for the ballerinax/mssql connector."
---

# Microsoft SQL Server Actions

The `ballerinax/mssql` connector extends the `sql:Client` interface with five core operations, identical to other SQL-based connectors.

## Client Initialization

```ballerina
import ballerinax/mssql;
import ballerinax/mssql.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 1433;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final mssql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    user = dbUser,
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

// Parameterized query with TOP
string dept = "Sales";
stream<Employee, sql:Error?> topStream =
    dbClient->query(`SELECT TOP 10 * FROM employees
                     WHERE department = ${dept}
                     ORDER BY salary DESC`);
```

## queryRow()

Returns a single row from the query result.

```ballerina
int empId = 42;
Employee emp = check dbClient->queryRow(
    `SELECT * FROM employees WHERE id = ${empId}`
);

// Scalar value
int count = check dbClient->queryRow(
    `SELECT COUNT(*) FROM employees`
);
```

## execute()

Executes INSERT, UPDATE, DELETE, or DDL statements.

```ballerina
// Insert with identity column
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO employees (first_name, last_name, department, salary)
     VALUES (${"Alice"}, ${"Smith"}, ${"Engineering"}, ${95000.00})`
);
io:println("Inserted ID: ", result.lastInsertId);

// Update
sql:ExecutionResult updateResult = check dbClient->execute(
    `UPDATE employees SET salary = ${100000.00} WHERE id = ${42}`
);
io:println("Updated rows: ", updateResult.affectedRowCount);

// Delete
_ = check dbClient->execute(
    `DELETE FROM employees WHERE id = ${42}`
);

// DDL -- Create table
_ = check dbClient->execute(`
    CREATE TABLE employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        department NVARCHAR(100),
        salary DECIMAL(10,2),
        created_at DATETIME2 DEFAULT GETDATE()
    )
`);
```

## batchExecute()

Executes a batch of parameterized DML statements.

```ballerina
type EmployeeInput record {|
    string first_name;
    string last_name;
    string department;
    decimal salary;
|};

EmployeeInput[] employees = [
    {first_name: "Alice", last_name: "Smith", department: "Engineering", salary: 95000},
    {first_name: "Bob", last_name: "Jones", department: "Marketing", salary: 72000}
];

sql:ParameterizedQuery[] queries = from var e in employees
    select `INSERT INTO employees (first_name, last_name, department, salary)
            VALUES (${e.first_name}, ${e.last_name}, ${e.department}, ${e.salary})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
```

## call()

Executes T-SQL stored procedures.

```ballerina
// Call with IN parameters
sql:ProcedureCallResult result = check dbClient->call(
    `EXEC GetEmployeesByDept @dept = ${"Engineering"}`
);
stream<record {}, sql:Error?>? resultStream = result.queryResult;
if resultStream is stream<record {}, sql:Error?> {
    check from var row in resultStream
        do {
            io:println(row);
        };
}
check result.close();

// Call with OUT parameters
sql:IntegerOutParameter totalCount = new;
sql:ProcedureCallResult result2 = check dbClient->call(
    `EXEC CountEmployees @dept = ${"Engineering"}, @total = ${totalCount} OUTPUT`
);
io:println("Count: ", totalCount.get(int));
check result2.close();
```

## Error Handling

```ballerina
do {
    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO employees (first_name, last_name)
         VALUES (${"Alice"}, ${"Smith"})`
    );
} on fail error e {
    if e is sql:DatabaseError {
        int? errorCode = e.detail().errorCode;
        // SQL Server error 2627 = Unique constraint violation
        // SQL Server error 547 = Foreign key constraint violation
        io:println("SQL Server error code: ", errorCode);
    }
    io:println("Error: ", e.message());
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
