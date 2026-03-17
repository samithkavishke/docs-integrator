---
title: "PostgreSQL - Examples"
description: "Code examples for the ballerinax/postgresql connector."
---

# PostgreSQL Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string dbHost = "localhost";
configurable int dbPort = 5432;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;
```

```toml
# Config.toml
dbUser = "postgres"
dbPassword = "postgres123"
dbName = "appdb"
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
    postgresql:Client dbClient = check new (
        host = dbHost, port = dbPort,
        username = dbUser, password = dbPassword,
        database = dbName
    );

    // Create table
    _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            price NUMERIC(10,2),
            stock INTEGER DEFAULT 0
        )
    `);

    // Insert
    sql:ExecutionResult insertResult = check dbClient->execute(
        `INSERT INTO products (name, category, price, stock)
         VALUES (${"Laptop"}, ${"Electronics"}, ${1299.99}, ${50})`
    );
    int productId = <int>insertResult.lastInsertId;

    // Read single row
    Product product = check dbClient->queryRow(
        `SELECT * FROM products WHERE id = ${productId}`
    );
    io:println("Product: ", product.name);

    // Read multiple rows
    stream<Product, sql:Error?> productStream = dbClient->query(
        `SELECT * FROM products WHERE category = ${"Electronics"}
         ORDER BY price DESC`
    );
    check from Product p in productStream
        do {
            io:println(string `${p.name}: $${p.price}`);
        };

    // Update
    _ = check dbClient->execute(
        `UPDATE products SET price = ${1199.99}, stock = stock - 1
         WHERE id = ${productId}`
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
function processOrder(postgresql:Client dbClient,
                      int customerId,
                      int productId,
                      int quantity) returns error? {
    transaction {
        // Check stock availability
        record {| int stock; decimal price; |} product =
            check dbClient->queryRow(
                `SELECT stock, price FROM products
                 WHERE id = ${productId} FOR UPDATE`
            );

        if product.stock < quantity {
            return error("Insufficient stock");
        }

        // Deduct stock
        _ = check dbClient->execute(
            `UPDATE products SET stock = stock - ${quantity}
             WHERE id = ${productId}`
        );

        // Create order
        decimal totalAmount = product.price * <decimal>quantity;
        sql:ExecutionResult orderResult = check dbClient->execute(
            `INSERT INTO orders (customer_id, product_id, quantity, total_amount, status)
             VALUES (${customerId}, ${productId}, ${quantity}, ${totalAmount}, ${"confirmed"})`
        );

        // Update customer total spend
        _ = check dbClient->execute(
            `UPDATE customers SET total_spent = total_spent + ${totalAmount}
             WHERE id = ${customerId}`
        );

        check commit;
        io:println(string `Order placed: ${orderResult.lastInsertId}`);
    }
}
```

## Example 3: Batch Operations

```ballerina
type SensorReading record {|
    string sensor_id;
    decimal temperature;
    decimal humidity;
    string timestamp;
|};

function batchInsertReadings(postgresql:Client dbClient,
                              SensorReading[] readings) returns error? {
    sql:ParameterizedQuery[] queries = from var r in readings
        select `INSERT INTO sensor_data (sensor_id, temperature, humidity, recorded_at)
                VALUES (${r.sensor_id}, ${r.temperature}, ${r.humidity},
                        ${r.timestamp}::TIMESTAMP)`;

    sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
    io:println(string `Inserted ${results.length()} sensor readings`);
}
```

## Example 4: Stored Procedures

```ballerina
// PostgreSQL function:
// CREATE FUNCTION get_department_stats(dept_name TEXT)
// RETURNS TABLE(employee_count BIGINT, avg_salary NUMERIC, max_salary NUMERIC)
// AS $$ BEGIN
//     RETURN QUERY SELECT COUNT(*), AVG(salary), MAX(salary)
//     FROM employees WHERE department = dept_name;
// END; $$ LANGUAGE plpgsql;

type DeptStats record {|
    int employee_count;
    decimal avg_salary;
    decimal max_salary;
|};

function getDepartmentStats(postgresql:Client dbClient,
                             string department) returns DeptStats|error {
    return dbClient->queryRow(
        `SELECT * FROM get_department_stats(${department})`
    );
}

// Stored procedure with OUT parameters
function transferFunds(postgresql:Client dbClient,
                       int senderId, int receiverId,
                       decimal amount) returns boolean|error {
    sql:InOutParameter success = new (false);
    sql:ProcedureCallResult result = check dbClient->call(
        `CALL transfer_funds(${senderId}, ${receiverId}, ${amount}, ${success})`
    );
    check result.close();
    return success.get(boolean);
}
```

## Example 5: REST API Service

```ballerina
type Task record {|
    int id;
    string title;
    string description;
    string status;
    string? assigned_to;
|};

type TaskInput record {|
    string title;
    string description;
    string? assigned_to;
|};

final postgresql:Client dbClient = check new (
    host = dbHost, port = dbPort,
    username = dbUser, password = dbPassword,
    database = dbName
);

service /api on new http:Listener(8080) {

    resource function get tasks(string? status) returns Task[]|error {
        sql:ParameterizedQuery query = status is string
            ? `SELECT * FROM tasks WHERE status = ${status} ORDER BY id`
            : `SELECT * FROM tasks ORDER BY id`;

        stream<Task, sql:Error?> taskStream = dbClient->query(query);
        return from Task t in taskStream select t;
    }

    resource function get tasks/[int id]() returns Task|http:NotFound|error {
        Task|sql:Error result = dbClient->queryRow(
            `SELECT * FROM tasks WHERE id = ${id}`
        );
        if result is sql:NoRowsError {
            return http:NOT_FOUND;
        }
        return result;
    }

    resource function post tasks(TaskInput input) returns record {|int id;|}|error {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO tasks (title, description, assigned_to, status)
             VALUES (${input.title}, ${input.description},
                     ${input.assigned_to}, ${"pending"})`
        );
        return {id: <int>result.lastInsertId};
    }

    resource function put tasks/[int id]/status(record {|string status;|} input)
            returns Task|error {
        _ = check dbClient->execute(
            `UPDATE tasks SET status = ${input.status} WHERE id = ${id}`
        );
        return dbClient->queryRow(`SELECT * FROM tasks WHERE id = ${id}`);
    }
}
```

## Example 6: Connection Pool Configuration

```ballerina
postgresql:Options pgOptions = {
    ssl: {
        mode: postgresql:REQUIRED
    },
    connectTimeout: 15
};

sql:ConnectionPool pool = {
    maxOpenConnections: 25,
    maxConnectionLifeTime: 1800,
    minIdleConnections: 5
};

final postgresql:Client dbClient = check new (
    host = dbHost, port = dbPort,
    username = dbUser, password = dbPassword,
    database = dbName,
    options = pgOptions,
    connectionPool = pool
);
```

## Example 7: Error Handling

```ballerina
function safeInsertUser(postgresql:Client dbClient,
                         string name, string email) returns int|error {
    do {
        sql:ExecutionResult result = check dbClient->execute(
            `INSERT INTO users (name, email) VALUES (${name}, ${email})`
        );
        return <int>result.lastInsertId;
    } on fail error e {
        if e is sql:DatabaseError {
            string? sqlState = e.detail().sqlState;
            match sqlState {
                "23505" => {
                    return error("User with this email already exists");
                }
                "23503" => {
                    return error("Referenced record does not exist");
                }
                "23502" => {
                    return error("Required field is missing");
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
