---
title: "Oracle Database - Actions"
description: "Available actions and operations for the ballerinax/oracledb connector."
---

# Oracle Database Actions

The `ballerinax/oracledb` connector extends the `sql:Client` interface with five core operations, supporting Oracle-specific SQL and PL/SQL features.

## Client Initialization

```ballerina
import ballerinax/oracledb;
import ballerinax/oracledb.driver as _;
import ballerina/sql;
import ballerina/io;

configurable string dbHost = "localhost";
configurable int dbPort = 1521;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final oracledb:Client dbClient = check new (
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
    int employee_id;
    string first_name;
    string last_name;
    string department_name;
    decimal salary;
|};

// Basic query
stream<Employee, sql:Error?> empStream =
    dbClient->query(`SELECT * FROM employees`);

check from Employee emp in empStream
    do {
        io:println(emp.first_name, " ", emp.last_name);
    };

// Parameterized query with Oracle-specific ROWNUM
string dept = "SALES";
stream<Employee, sql:Error?> topStream =
    dbClient->query(`SELECT * FROM employees
                     WHERE department_name = ${dept}
                     AND ROWNUM <= 10
                     ORDER BY salary DESC`);
```

## queryRow()

Returns a single row.

```ballerina
int empId = 100;
Employee emp = check dbClient->queryRow(
    `SELECT * FROM employees WHERE employee_id = ${empId}`
);

// Scalar value using Oracle DUAL
string sysdate = check dbClient->queryRow(
    `SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL`
);
```

## execute()

Executes INSERT, UPDATE, DELETE, or DDL statements.

```ballerina
// Insert with Oracle sequence
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO employees (employee_id, first_name, last_name, department_name, salary)
     VALUES (employees_seq.NEXTVAL, ${"Alice"}, ${"Smith"}, ${"Engineering"}, ${95000.00})`
);

// Update
sql:ExecutionResult updateResult = check dbClient->execute(
    `UPDATE employees SET salary = ${100000.00}
     WHERE employee_id = ${100}`
);

// Delete
_ = check dbClient->execute(
    `DELETE FROM employees WHERE employee_id = ${100}`
);

// DDL
_ = check dbClient->execute(`
    CREATE TABLE employees (
        employee_id NUMBER PRIMARY KEY,
        first_name VARCHAR2(100) NOT NULL,
        last_name VARCHAR2(100) NOT NULL,
        department_name VARCHAR2(100),
        salary NUMBER(10,2),
        hire_date DATE DEFAULT SYSDATE
    )
`);
```

## batchExecute()

Executes a batch of parameterized DML statements.

```ballerina
type EmpInput record {|
    string first_name;
    string last_name;
    string department;
    decimal salary;
|};

EmpInput[] employees = [
    {first_name: "Alice", last_name: "Smith", department: "Engineering", salary: 95000},
    {first_name: "Bob", last_name: "Jones", department: "Marketing", salary: 72000}
];

sql:ParameterizedQuery[] queries = from var e in employees
    select `INSERT INTO employees (employee_id, first_name, last_name, department_name, salary)
            VALUES (employees_seq.NEXTVAL, ${e.first_name}, ${e.last_name},
                    ${e.department}, ${e.salary})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
```

## call()

Executes PL/SQL stored procedures and functions.

```ballerina
// Call with IN parameters
sql:ProcedureCallResult result = check dbClient->call(
    `CALL get_employee_details(${100})`
);
stream<record {}, sql:Error?>? resultStream = result.queryResult;
if resultStream is stream<record {}, sql:Error?> {
    check from var row in resultStream
        do { io:println(row); };
}
check result.close();

// Call with OUT parameters
sql:VarcharOutParameter empName = new;
sql:DecimalOutParameter empSalary = new;
sql:ProcedureCallResult result2 = check dbClient->call(
    `CALL get_emp_info(${100}, ${empName}, ${empSalary})`
);
io:println("Name: ", empName.get(string));
io:println("Salary: ", empSalary.get(decimal));
check result2.close();
```

## Error Handling

```ballerina
do {
    _ = check dbClient->execute(
        `INSERT INTO employees (employee_id, first_name, last_name)
         VALUES (${100}, ${"Alice"}, ${"Smith"})`
    );
} on fail error e {
    if e is sql:DatabaseError {
        int? errorCode = e.detail().errorCode;
        // ORA-00001 = unique constraint violation
        // ORA-02291 = integrity constraint (FK) violation
        io:println("Oracle error code: ", errorCode);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
