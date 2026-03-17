---
title: "JDBC (Generic) - Actions"
description: "Available actions and operations for the ballerinax/java.jdbc connector."
---

# JDBC (Generic) Actions

The `ballerinax/java.jdbc` connector implements the `sql:Client` interface, providing the same five core operations available in all SQL-based connectors.

## Client Initialization

```ballerina
import ballerinax/java.jdbc;
import ballerina/sql;
import ballerina/io;

configurable string jdbcUrl = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

final jdbc:Client dbClient = check new (
    url = jdbcUrl,
    user = dbUser,
    password = dbPassword
);
```

## query()

Executes a SELECT query and returns results as a stream.

```ballerina
type Product record {|
    int id;
    string name;
    decimal price;
    int quantity;
|};

// Basic query
stream<Product, sql:Error?> productStream =
    dbClient->query(`SELECT * FROM products`);

check from Product p in productStream
    do {
        io:println(p.name, ": $", p.price);
    };

// Parameterized query
string category = "Electronics";
stream<Product, sql:Error?> filteredStream =
    dbClient->query(`SELECT * FROM products
                     WHERE category = ${category}
                     ORDER BY price DESC`);
```

## queryRow()

Returns a single row from the query result.

```ballerina
int productId = 42;
Product product = check dbClient->queryRow(
    `SELECT * FROM products WHERE id = ${productId}`
);

// Scalar value
int count = check dbClient->queryRow(
    `SELECT COUNT(*) FROM products`
);
```

## execute()

Executes INSERT, UPDATE, DELETE, or DDL statements.

```ballerina
// Insert
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO products (name, price, quantity)
     VALUES (${"Widget"}, ${19.99}, ${100})`
);
io:println("Inserted ID: ", result.lastInsertId);

// Update
sql:ExecutionResult updateResult = check dbClient->execute(
    `UPDATE products SET price = ${24.99} WHERE id = ${1}`
);

// Delete
_ = check dbClient->execute(
    `DELETE FROM products WHERE id = ${1}`
);

// DDL
_ = check dbClient->execute(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2),
        quantity INT DEFAULT 0
    )
`);
```

## batchExecute()

Executes a batch of parameterized DML statements.

```ballerina
type ProductInput record {|
    string name;
    decimal price;
    int quantity;
|};

ProductInput[] products = [
    {name: "Widget A", price: 19.99, quantity: 100},
    {name: "Widget B", price: 29.99, quantity: 50}
];

sql:ParameterizedQuery[] queries = from var p in products
    select `INSERT INTO products (name, price, quantity)
            VALUES (${p.name}, ${p.price}, ${p.quantity})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(queries);
```

## call()

Executes stored procedures.

```ballerina
// Call with IN parameter
sql:ProcedureCallResult result = check dbClient->call(
    `CALL update_stock(${42}, ${10})`
);
check result.close();

// Call with OUT parameter
sql:IntegerOutParameter total = new;
sql:ProcedureCallResult result2 = check dbClient->call(
    `CALL get_total_products(${total})`
);
io:println("Total: ", total.get(int));
check result2.close();
```

## Error Handling

```ballerina
do {
    sql:ExecutionResult result = check dbClient->execute(
        `INSERT INTO products (name, price) VALUES (${"Widget"}, ${19.99})`
    );
} on fail error e {
    if e is sql:DatabaseError {
        io:println("DB error code: ", e.detail().errorCode);
        io:println("SQL state: ", e.detail().sqlState);
    }
    io:println("Error: ", e.message());
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
