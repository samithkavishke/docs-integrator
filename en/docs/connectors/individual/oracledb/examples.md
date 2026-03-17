---
title: "Oracle Database - Examples"
description: "Code examples for the ballerinax/oracledb connector."
---

# Oracle Database Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/oracledb;
import ballerinax/oracledb.driver as _;

configurable string dbHost = "localhost";
configurable int dbPort = 1521;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;
```

```toml
# Config.toml
dbUser = "admin"
dbPassword = "oracle123"
dbName = "ORCLCDB.localdomain"
```

## Example 1: CRUD Operations

```ballerina
type Department record {|
    int department_id;
    string department_name;
    string? manager_name;
    int employee_count;
|};

public function main() returns error? {
    oracledb:Client dbClient = check new (
        host = dbHost, port = dbPort,
        user = dbUser, password = dbPassword,
        database = dbName
    );

    // Create
    sql:ExecutionResult insertResult = check dbClient->execute(
        `INSERT INTO departments (department_id, department_name, manager_name)
         VALUES (departments_seq.NEXTVAL, ${"Data Science"}, ${"Dr. Smith"})`
    );
    io:println("Inserted department");

    // Read all
    stream<Department, sql:Error?> deptStream = dbClient->query(
        `SELECT d.department_id, d.department_name, d.manager_name,
                COUNT(e.employee_id) AS employee_count
         FROM departments d
         LEFT JOIN employees e ON d.department_id = e.department_id
         GROUP BY d.department_id, d.department_name, d.manager_name
         ORDER BY d.department_name`
    );
    check from Department d in deptStream
        do {
            io:println(string `${d.department_name}: ${d.employee_count} employees`);
        };

    // Update
    _ = check dbClient->execute(
        `UPDATE departments SET manager_name = ${"Dr. Johnson"}
         WHERE department_name = ${"Data Science"}`
    );

    // Delete
    _ = check dbClient->execute(
        `DELETE FROM departments WHERE department_name = ${"Data Science"}`
    );

    check dbClient.close();
}
```

## Example 2: PL/SQL Stored Procedures

```ballerina
// PL/SQL procedure:
// CREATE OR REPLACE PROCEDURE calculate_bonus(
//     p_employee_id IN NUMBER,
//     p_bonus_pct IN NUMBER,
//     p_bonus_amount OUT NUMBER,
//     p_new_salary OUT NUMBER
// ) IS
//     v_salary NUMBER;
// BEGIN
//     SELECT salary INTO v_salary FROM employees WHERE employee_id = p_employee_id;
//     p_bonus_amount := v_salary * (p_bonus_pct / 100);
//     p_new_salary := v_salary + p_bonus_amount;
//     UPDATE employees SET salary = p_new_salary WHERE employee_id = p_employee_id;
// END;

function calculateEmployeeBonus(oracledb:Client dbClient,
                                  int employeeId,
                                  decimal bonusPct) returns error? {
    sql:DecimalOutParameter bonusAmount = new;
    sql:DecimalOutParameter newSalary = new;

    sql:ProcedureCallResult result = check dbClient->call(
        `CALL calculate_bonus(${employeeId}, ${bonusPct}, ${bonusAmount}, ${newSalary})`
    );

    io:println("Bonus amount: $", bonusAmount.get(decimal));
    io:println("New salary: $", newSalary.get(decimal));
    check result.close();
}
```

## Example 3: Transactions

```ballerina
function processPayroll(oracledb:Client dbClient, int departmentId) returns error? {
    transaction {
        // Get all employees in department
        stream<record {| int employee_id; decimal salary; |}, sql:Error?> empStream =
            dbClient->query(
                `SELECT employee_id, salary FROM employees
                 WHERE department_id = ${departmentId}`
            );

        record {| int employee_id; decimal salary; |}[] employees =
            check from var emp in empStream select emp;

        // Apply 5% raise to each employee
        foreach var emp in employees {
            decimal newSalary = emp.salary * 1.05;
            _ = check dbClient->execute(
                `UPDATE employees SET salary = ${newSalary}
                 WHERE employee_id = ${emp.employee_id}`
            );

            // Log the payroll change
            _ = check dbClient->execute(
                `INSERT INTO payroll_log (employee_id, old_salary, new_salary, change_date)
                 VALUES (${emp.employee_id}, ${emp.salary}, ${newSalary}, SYSDATE)`
            );
        }

        check commit;
        io:println(string `Processed payroll for ${employees.length()} employees`);
    }
}
```

## Example 4: Batch Insert

```ballerina
type AuditEntry record {|
    string action_type;
    string table_name;
    string user_name;
    string details;
|};

function batchInsertAuditLog(oracledb:Client dbClient,
                              AuditEntry[] entries) returns error? {
    sql:ParameterizedQuery[] queries = from var entry in entries
        select `INSERT INTO audit_log (log_id, action_type, table_name, user_name, details, log_date)
                VALUES (audit_seq.NEXTVAL, ${entry.action_type}, ${entry.table_name},
                        ${entry.user_name}, ${entry.details}, SYSDATE)`;

    sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
    io:println(string `Inserted ${results.length()} audit entries`);
}
```

## Example 5: REST API with Oracle

```ballerina
type Product record {|
    int product_id;
    string product_name;
    string category;
    decimal price;
    int stock_quantity;
|};

type ProductInput record {|
    string product_name;
    string category;
    decimal price;
    int stock_quantity;
|};

final oracledb:Client dbClient = check new (
    host = dbHost, port = dbPort,
    user = dbUser, password = dbPassword,
    database = dbName
);

service /api on new http:Listener(8080) {

    resource function get products(string? category) returns Product[]|error {
        sql:ParameterizedQuery query = category is string
            ? `SELECT * FROM products WHERE category = ${category} ORDER BY product_name`
            : `SELECT * FROM products ORDER BY product_name`;
        stream<Product, sql:Error?> productStream = dbClient->query(query);
        return from Product p in productStream select p;
    }

    resource function get products/[int id]() returns Product|http:NotFound|error {
        Product|sql:Error result = dbClient->queryRow(
            `SELECT * FROM products WHERE product_id = ${id}`
        );
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        }
        return result;
    }

    resource function post products(ProductInput input)
            returns record {|string message;|}|error {
        _ = check dbClient->execute(
            `INSERT INTO products (product_id, product_name, category, price, stock_quantity)
             VALUES (products_seq.NEXTVAL, ${input.product_name}, ${input.category},
                     ${input.price}, ${input.stock_quantity})`
        );
        return {message: "Product created"};
    }
}
```

## Example 6: Error Handling

```ballerina
function safeOracleInsert(oracledb:Client dbClient,
                           string name, decimal salary) returns error? {
    do {
        _ = check dbClient->execute(
            `INSERT INTO employees (employee_id, first_name, salary)
             VALUES (employees_seq.NEXTVAL, ${name}, ${salary})`
        );
    } on fail error e {
        if e is sql:DatabaseError {
            int? errorCode = e.detail().errorCode;
            match errorCode {
                1 => {
                    return error("ORA-00001: Unique constraint violated");
                }
                2291 => {
                    return error("ORA-02291: Foreign key constraint violated");
                }
                1400 => {
                    return error("ORA-01400: Cannot insert NULL into a NOT NULL column");
                }
            }
        }
        return error("Oracle database error", e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
