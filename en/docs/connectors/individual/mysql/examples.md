---
title: "MySQL - Examples"
description: "Code examples for the ballerinax/mysql connector."
---

# MySQL Examples

## Setup for All Examples

All examples use the following common setup:

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;
```

```toml
# Config.toml
dbHost = "localhost"
dbPort = 3306
dbUser = "root"
dbPassword = "mysql123"
dbName = "inventory_db"
```

## Example 1: CRUD Operations

A complete create-read-update-delete example using a `products` table:

```ballerina
type Product record {|
    int id;
    string name;
    string category;
    decimal price;
    int stock_quantity;
|};

public function main() returns error? {
    mysql:Client dbClient = check new (
        host = dbHost, port = dbPort,
        user = dbUser, password = dbPassword,
        database = dbName
    );

    // CREATE -- Insert a new product
    sql:ExecutionResult insertResult = check dbClient->execute(
        `INSERT INTO products (name, category, price, stock_quantity)
         VALUES (${"Wireless Mouse"}, ${"Electronics"}, ${29.99}, ${150})`
    );
    int? productId = <int?>insertResult.lastInsertId;
    io:println("Inserted product ID: ", productId);

    // READ -- Query all products in a category
    stream<Product, sql:Error?> productStream = dbClient->query(
        `SELECT id, name, category, price, stock_quantity
         FROM products
         WHERE category = ${"Electronics"}`
    );
    check from Product p in productStream
        do {
            io:println(string `Product: ${p.name} - $${p.price}`);
        };

    // READ -- Get a single product
    if productId is int {
        Product product = check dbClient->queryRow(
            `SELECT id, name, category, price, stock_quantity
             FROM products WHERE id = ${productId}`
        );
        io:println("Found product: ", product.name);
    }

    // UPDATE -- Change price
    sql:ExecutionResult updateResult = check dbClient->execute(
        `UPDATE products SET price = ${24.99} WHERE id = ${productId}`
    );
    io:println("Updated rows: ", updateResult.affectedRowCount);

    // DELETE -- Remove product
    sql:ExecutionResult deleteResult = check dbClient->execute(
        `DELETE FROM products WHERE id = ${productId}`
    );
    io:println("Deleted rows: ", deleteResult.affectedRowCount);

    check dbClient.close();
}
```

## Example 2: Parameterized Queries with Complex Filters

```ballerina
type OrderSummary record {|
    int order_id;
    string customer_name;
    decimal total_amount;
    string status;
    string order_date;
|};

function getFilteredOrders(mysql:Client dbClient,
                           string status,
                           decimal minAmount,
                           int 'limit) returns OrderSummary[]|error {

    sql:ParameterizedQuery query = `
        SELECT o.id AS order_id,
               c.name AS customer_name,
               o.total_amount,
               o.status,
               CAST(o.order_date AS CHAR) AS order_date
        FROM orders o
        INNER JOIN customers c ON o.customer_id = c.id
        WHERE o.status = ${status}
          AND o.total_amount >= ${minAmount}
        ORDER BY o.order_date DESC
        LIMIT ${'limit}
    `;

    stream<OrderSummary, sql:Error?> resultStream = dbClient->query(query);
    return from OrderSummary order in resultStream select order;
}
```

## Example 3: Transactions

```ballerina
function transferFunds(mysql:Client dbClient,
                       int fromAccountId,
                       int toAccountId,
                       decimal amount) returns error? {

    // Start a transaction
    transaction {
        // Debit from source account
        sql:ExecutionResult debitResult = check dbClient->execute(
            `UPDATE accounts SET balance = balance - ${amount}
             WHERE id = ${fromAccountId} AND balance >= ${amount}`
        );

        if debitResult.affectedRowCount == 0 {
            return error("Insufficient funds or account not found");
        }

        // Credit to destination account
        sql:ExecutionResult creditResult = check dbClient->execute(
            `UPDATE accounts SET balance = balance + ${amount}
             WHERE id = ${toAccountId}`
        );

        if creditResult.affectedRowCount == 0 {
            return error("Destination account not found");
        }

        // Record the transfer
        _ = check dbClient->execute(
            `INSERT INTO transfers (from_account, to_account, amount, transfer_date)
             VALUES (${fromAccountId}, ${toAccountId}, ${amount}, NOW())`
        );

        // Commit the transaction
        check commit;
    }
    io:println(string `Transferred $${amount} from account ${fromAccountId} to ${toAccountId}`);
}
```

## Example 4: Batch Insert

```ballerina
type EmployeeInput record {|
    string first_name;
    string last_name;
    string department;
    decimal salary;
|};

function batchInsertEmployees(mysql:Client dbClient,
                               EmployeeInput[] employees) returns error? {

    sql:ParameterizedQuery[] insertQueries = from var emp in employees
        select `INSERT INTO employees (first_name, last_name, department, salary)
                VALUES (${emp.first_name}, ${emp.last_name},
                        ${emp.department}, ${emp.salary})`;

    sql:ExecutionResult[] results = check dbClient->batchExecute(insertQueries);

    int successCount = 0;
    foreach sql:ExecutionResult result in results {
        if result.affectedRowCount > 0 {
            successCount += 1;
        }
    }
    io:println(string `Successfully inserted ${successCount} of ${employees.length()} employees`);
}

public function main() returns error? {
    mysql:Client dbClient = check new (
        host = dbHost, user = dbUser,
        password = dbPassword, database = dbName
    );

    EmployeeInput[] newEmployees = [
        {first_name: "Alice", last_name: "Smith", department: "Engineering", salary: 85000},
        {first_name: "Bob", last_name: "Jones", department: "Marketing", salary: 72000},
        {first_name: "Carol", last_name: "White", department: "Engineering", salary: 92000},
        {first_name: "Dave", last_name: "Brown", department: "Sales", salary: 68000}
    ];

    check batchInsertEmployees(dbClient, newEmployees);
    check dbClient.close();
}
```

## Example 5: Stored Procedures

```ballerina
// MySQL stored procedure:
// CREATE PROCEDURE GetOrderStats(
//     IN customerId INT,
//     OUT orderCount INT,
//     OUT totalSpent DECIMAL(10,2)
// )
// BEGIN
//     SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
//     INTO orderCount, totalSpent
//     FROM orders WHERE customer_id = customerId;
// END;

function getCustomerOrderStats(mysql:Client dbClient,
                                int customerId) returns error? {

    sql:IntegerOutParameter orderCount = new;
    sql:DecimalOutParameter totalSpent = new;

    sql:ProcedureCallResult result = check dbClient->call(
        `CALL GetOrderStats(${customerId}, ${orderCount}, ${totalSpent})`
    );

    io:println("Order count: ", orderCount.get(int));
    io:println("Total spent: ", totalSpent.get(decimal));
    check result.close();
}

// Stored procedure returning a result set
// CREATE PROCEDURE GetRecentOrders(IN customerId INT, IN orderLimit INT)
// BEGIN
//     SELECT * FROM orders
//     WHERE customer_id = customerId
//     ORDER BY order_date DESC
//     LIMIT orderLimit;
// END;

type Order record {|
    int id;
    int customer_id;
    decimal total_amount;
    string status;
|};

function getRecentOrders(mysql:Client dbClient,
                         int customerId) returns Order[]|error {

    sql:ProcedureCallResult result = check dbClient->call(
        `CALL GetRecentOrders(${customerId}, ${10})`,
        [Order]
    );

    stream<record {}, sql:Error?>? resultStream = result.queryResult;
    Order[] orders = [];
    if resultStream is stream<record {}, sql:Error?> {
        orders = check from var row in resultStream
            select <Order>row;
    }
    check result.close();
    return orders;
}
```

## Example 6: Connection Pool Configuration

```ballerina
// Production configuration with tuned connection pool
mysql:Options mysqlOptions = {
    ssl: {
        mode: mysql:SSL_PREFERRED
    },
    connectTimeout: 10
};

sql:ConnectionPool pool = {
    maxOpenConnections: 25,
    maxConnectionLifeTime: 1800,
    minIdleConnections: 5
};

final mysql:Client dbClient = check new (
    host = dbHost,
    port = dbPort,
    user = dbUser,
    password = dbPassword,
    database = dbName,
    options = mysqlOptions,
    connectionPool = pool
);
```

## Example 7: REST API with MySQL

A complete HTTP service backed by MySQL:

```ballerina
type Customer record {|
    int id;
    string name;
    string email;
|};

type CustomerInput record {|
    string name;
    string email;
|};

final mysql:Client dbClient = check new (
    host = dbHost, port = dbPort,
    user = dbUser, password = dbPassword,
    database = dbName
);

service /api on new http:Listener(8080) {

    resource function get customers() returns Customer[]|error {
        stream<Customer, sql:Error?> customerStream =
            dbClient->query(`SELECT id, name, email FROM customers`);
        return from Customer c in customerStream select c;
    }

    resource function get customers/[int id]() returns Customer|http:NotFound|error {
        Customer|sql:Error result = dbClient->queryRow(
            `SELECT id, name, email FROM customers WHERE id = ${id}`
        );
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        }
        return result;
    }

    resource function post customers(CustomerInput input)
            returns record {|int id;|}|error {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO customers (name, email)
             VALUES (${input.name}, ${input.email})`
        );
        int? insertId = <int?>result.lastInsertId;
        return {id: insertId ?: 0};
    }

    resource function put customers/[int id](CustomerInput input)
            returns Customer|error {
        _ = check dbClient->execute(
            `UPDATE customers SET name = ${input.name}, email = ${input.email}
             WHERE id = ${id}`
        );
        return dbClient->queryRow(
            `SELECT id, name, email FROM customers WHERE id = ${id}`
        );
    }

    resource function delete customers/[int id]()
            returns http:NoContent|error {
        _ = check dbClient->execute(
            `DELETE FROM customers WHERE id = ${id}`
        );
        return http:NO_CONTENT;
    }
}
```

## Example 8: Error Handling Patterns

```ballerina
function robustInsert(mysql:Client dbClient, string name, string email) returns int|error {
    do {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO customers (name, email) VALUES (${name}, ${email})`
        );
        int? id = <int?>result.lastInsertId;
        return id ?: 0;
    } on fail error e {
        if e is sql:DatabaseError {
            int? errorCode = e.detail().errorCode;
            // MySQL error 1062 = Duplicate entry
            if errorCode == 1062 {
                return error("A customer with this email already exists");
            }
        }
        return error("Failed to insert customer", e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
