---
title: "Snowflake - Actions"
description: "Available actions and operations for the ballerinax/snowflake connector."
---

# Snowflake Actions

The `ballerinax/snowflake` connector extends the `sql:Client` interface, providing standard SQL operations for the Snowflake cloud data warehouse.

## Client Initialization

```ballerina
import ballerinax/snowflake;
import ballerinax/snowflake.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string accountIdentifier = ?;
configurable string user = ?;
configurable string password = ?;

snowflake:Options sfOptions = {
    properties: {
        "warehouse": "COMPUTE_WH",
        "db": "MY_DATABASE",
        "schema": "PUBLIC"
    }
};

final snowflake:Client sfClient = check new (
    accountIdentifier, user, password, sfOptions
);
```

## query()

Executes a SELECT query and returns results as a stream.

```ballerina
type SalesRecord record {|
    string product_name;
    string region;
    decimal revenue;
    int units_sold;
    string sale_date;
|};

// Basic query
stream<SalesRecord, sql:Error?> salesStream =
    sfClient->query(`SELECT * FROM MY_DB.PUBLIC.SALES`);

check from SalesRecord sale in salesStream
    do {
        io:println(sale.product_name, ": $", sale.revenue);
    };

// Parameterized query
string region = "US-West";
stream<SalesRecord, sql:Error?> filteredStream =
    sfClient->query(`SELECT * FROM MY_DB.PUBLIC.SALES
                     WHERE region = ${region}
                     ORDER BY revenue DESC
                     LIMIT 100`);
```

## queryRow()

Returns a single row from the query result.

```ballerina
// Get aggregate value
decimal totalRevenue = check sfClient->queryRow(
    `SELECT SUM(revenue) FROM MY_DB.PUBLIC.SALES
     WHERE region = ${"US-West"}`
);

// Get a single record
type UserInfo record {|
    string name;
    string email;
    string role;
|};

UserInfo user = check sfClient->queryRow(
    `SELECT name, email, role FROM MY_DB.PUBLIC.USERS
     WHERE email = ${"alice@example.com"}`
);
```

## execute()

Executes DDL and DML statements.

```ballerina
// Create table
_ = check sfClient->execute(`
    CREATE TABLE IF NOT EXISTS MY_DB.PUBLIC.EMPLOYEES (
        ID INT AUTOINCREMENT,
        FIRST_NAME VARCHAR(255),
        LAST_NAME VARCHAR(255),
        DEPARTMENT VARCHAR(255),
        SALARY NUMBER(10,2),
        HIRE_DATE DATE DEFAULT CURRENT_DATE(),
        PRIMARY KEY (ID)
    )
`);

// Insert
sql:ExecutionResult result = check sfClient->execute(
    `INSERT INTO MY_DB.PUBLIC.EMPLOYEES (FIRST_NAME, LAST_NAME, DEPARTMENT, SALARY)
     VALUES (${"Alice"}, ${"Smith"}, ${"Engineering"}, ${95000.00})`
);

// Update
sql:ExecutionResult updateResult = check sfClient->execute(
    `UPDATE MY_DB.PUBLIC.EMPLOYEES SET SALARY = ${100000.00}
     WHERE FIRST_NAME = ${"Alice"} AND LAST_NAME = ${"Smith"}`
);

// Delete
_ = check sfClient->execute(
    `DELETE FROM MY_DB.PUBLIC.EMPLOYEES WHERE ID = ${1}`
);
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
    select `INSERT INTO MY_DB.PUBLIC.EMPLOYEES (FIRST_NAME, LAST_NAME, DEPARTMENT, SALARY)
            VALUES (${e.first_name}, ${e.last_name}, ${e.department}, ${e.salary})`;

sql:ExecutionResult[] results = check sfClient->batchExecute(queries);
```

## call()

Executes stored procedures.

```ballerina
sql:ProcedureCallResult result = check sfClient->call(
    `CALL MY_DB.PUBLIC.PROCESS_DAILY_SALES(${"2024-01-15"})`
);
check result.close();
```

## Error Handling

```ballerina
do {
    _ = check sfClient->execute(
        `INSERT INTO MY_DB.PUBLIC.EMPLOYEES (FIRST_NAME, LAST_NAME)
         VALUES (${"Alice"}, ${"Smith"})`
    );
} on fail error e {
    if e is sql:DatabaseError {
        io:println("Snowflake error: ", e.message());
        io:println("Error code: ", e.detail().errorCode);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
