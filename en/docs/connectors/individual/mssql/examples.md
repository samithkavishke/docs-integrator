---
title: "Microsoft SQL Server - Examples"
description: "Code examples for the ballerinax/mssql connector."
---

# Microsoft SQL Server Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/mssql;
import ballerinax/mssql.driver as _;

configurable string dbHost = "localhost";
configurable int dbPort = 1433;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;
```

```toml
# Config.toml
dbUser = "sa"
dbPassword = "YourStrong@Password"
dbName = "inventory_db"
```

## Example 1: CRUD Operations

```ballerina
type Product record {|
    int id;
    string name;
    string category;
    decimal price;
    int stock;
|};

public function main() returns error? {
    mssql:Client dbClient = check new (
        host = dbHost, port = dbPort,
        user = dbUser, password = dbPassword,
        database = dbName
    );

    // Create table
    _ = check dbClient->execute(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='products')
        CREATE TABLE products (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            category NVARCHAR(100),
            price DECIMAL(10,2),
            stock INT DEFAULT 0
        )
    `);

    // Insert
    sql:ExecutionResult insertResult = check dbClient->execute(
        `INSERT INTO products (name, category, price, stock)
         VALUES (${"Keyboard"}, ${"Electronics"}, ${49.99}, ${200})`
    );
    int productId = <int>insertResult.lastInsertId;
    io:println("Inserted product ID: ", productId);

    // Read single
    Product product = check dbClient->queryRow(
        `SELECT * FROM products WHERE id = ${productId}`
    );
    io:println("Product: ", product.name);

    // Read multiple
    stream<Product, sql:Error?> products = dbClient->query(
        `SELECT TOP 20 * FROM products
         WHERE category = ${"Electronics"}
         ORDER BY price DESC`
    );
    check from Product p in products
        do {
            io:println(string `${p.name}: $${p.price}`);
        };

    // Update
    _ = check dbClient->execute(
        `UPDATE products SET price = ${39.99} WHERE id = ${productId}`
    );

    // Delete
    _ = check dbClient->execute(
        `DELETE FROM products WHERE id = ${productId}`
    );

    check dbClient.close();
}
```

## Example 2: Transactions

```ballerina
function transferInventory(mssql:Client dbClient,
                            int fromWarehouse,
                            int toWarehouse,
                            int productId,
                            int quantity) returns error? {
    transaction {
        // Deduct from source warehouse
        sql:ExecutionResult deductResult = check dbClient->execute(
            `UPDATE warehouse_stock
             SET quantity = quantity - ${quantity}
             WHERE warehouse_id = ${fromWarehouse}
               AND product_id = ${productId}
               AND quantity >= ${quantity}`
        );

        if deductResult.affectedRowCount == 0 {
            return error("Insufficient stock in source warehouse");
        }

        // Add to destination warehouse (upsert with MERGE)
        _ = check dbClient->execute(
            `MERGE warehouse_stock AS target
             USING (SELECT ${toWarehouse} AS warehouse_id, ${productId} AS product_id) AS source
             ON target.warehouse_id = source.warehouse_id
                AND target.product_id = source.product_id
             WHEN MATCHED THEN
                 UPDATE SET quantity = target.quantity + ${quantity}
             WHEN NOT MATCHED THEN
                 INSERT (warehouse_id, product_id, quantity)
                 VALUES (${toWarehouse}, ${productId}, ${quantity});`
        );

        // Log the transfer
        _ = check dbClient->execute(
            `INSERT INTO transfer_log (from_warehouse, to_warehouse, product_id, quantity)
             VALUES (${fromWarehouse}, ${toWarehouse}, ${productId}, ${quantity})`
        );

        check commit;
    }
}
```

## Example 3: Batch Insert

```ballerina
type LogEntry record {|
    string level;
    string message;
    string source;
|};

function batchInsertLogs(mssql:Client dbClient, LogEntry[] entries) returns error? {
    sql:ParameterizedQuery[] queries = from var entry in entries
        select `INSERT INTO audit_log (level, message, source, created_at)
                VALUES (${entry.level}, ${entry.message}, ${entry.source}, GETDATE())`;

    sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
    io:println(string `Logged ${results.length()} entries`);
}
```

## Example 4: Stored Procedures

```ballerina
// T-SQL Stored Procedure:
// CREATE PROCEDURE sp_GetSalesReport
//     @StartDate DATE,
//     @EndDate DATE,
//     @TotalSales DECIMAL(12,2) OUTPUT
// AS BEGIN
//     SELECT @TotalSales = SUM(amount) FROM sales
//     WHERE sale_date BETWEEN @StartDate AND @EndDate;
//
//     SELECT product_name, SUM(quantity) AS units_sold, SUM(amount) AS revenue
//     FROM sales WHERE sale_date BETWEEN @StartDate AND @EndDate
//     GROUP BY product_name ORDER BY revenue DESC;
// END;

type SalesRow record {|
    string product_name;
    int units_sold;
    decimal revenue;
|};

function getSalesReport(mssql:Client dbClient,
                         string startDate,
                         string endDate) returns error? {

    sql:DecimalOutParameter totalSales = new;

    sql:ProcedureCallResult result = check dbClient->call(
        `EXEC sp_GetSalesReport @StartDate = ${startDate},
                                @EndDate = ${endDate},
                                @TotalSales = ${totalSales} OUTPUT`,
        [SalesRow]
    );

    io:println("Total sales: $", totalSales.get(decimal));

    stream<record {}, sql:Error?>? resultStream = result.queryResult;
    if resultStream is stream<record {}, sql:Error?> {
        check from var row in resultStream
            do {
                io:println(row);
            };
    }
    check result.close();
}
```

## Example 5: REST API with MSSQL

```ballerina
type Customer record {|
    int id;
    string name;
    string email;
    string? phone;
|};

type CustomerInput record {|
    string name;
    string email;
    string? phone;
|};

final mssql:Client dbClient = check new (
    host = dbHost, port = dbPort,
    user = dbUser, password = dbPassword,
    database = dbName
);

service /api on new http:Listener(8080) {

    resource function get customers(int 'limit = 50) returns Customer[]|error {
        stream<Customer, sql:Error?> customerStream = dbClient->query(
            `SELECT TOP ${'limit} id, name, email, phone
             FROM customers ORDER BY name`
        );
        return from Customer c in customerStream select c;
    }

    resource function get customers/[int id]() returns Customer|http:NotFound|error {
        Customer|sql:Error result = dbClient->queryRow(
            `SELECT id, name, email, phone FROM customers WHERE id = ${id}`
        );
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        }
        return result;
    }

    resource function post customers(CustomerInput input)
            returns record {|int id;|}|error {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO customers (name, email, phone)
             VALUES (${input.name}, ${input.email}, ${input.phone})`
        );
        return {id: <int>result.lastInsertId};
    }

    resource function delete customers/[int id]() returns http:NoContent|error {
        _ = check dbClient->execute(
            `DELETE FROM customers WHERE id = ${id}`
        );
        return http:NO_CONTENT;
    }
}
```

## Example 6: Error Handling

```ballerina
function safeInsert(mssql:Client dbClient,
                    string name, string email) returns int|error {
    do {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO customers (name, email) VALUES (${name}, ${email})`
        );
        return <int>result.lastInsertId;
    } on fail error e {
        if e is sql:DatabaseError {
            int? errorCode = e.detail().errorCode;
            match errorCode {
                2627 => {
                    return error("Duplicate entry: a customer with this email exists");
                }
                547 => {
                    return error("Foreign key violation");
                }
                515 => {
                    return error("Cannot insert NULL into a required column");
                }
            }
        }
        return error("Database operation failed", e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
