---
title: "Snowflake - Examples"
description: "Code examples for the ballerinax/snowflake connector."
---

# Snowflake Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/sql;
import ballerina/http;
import ballerinax/snowflake;
import ballerinax/snowflake.driver as _;

configurable string accountIdentifier = ?;
configurable string user = ?;
configurable string password = ?;
```

```toml
# Config.toml
accountIdentifier = "xy12345.us-east-1"
user = "my_user"
password = "my_secure_password"
```

## Example 1: Data Warehouse Queries

```ballerina
type SalesSummary record {|
    string region;
    string product_category;
    decimal total_revenue;
    int total_orders;
    decimal avg_order_value;
|};

public function main() returns error? {
    snowflake:Options sfOptions = {
        properties: {
            "warehouse": "ANALYTICS_WH",
            "db": "SALES_DB",
            "schema": "PUBLIC"
        }
    };

    snowflake:Client sfClient = check new (
        accountIdentifier, user, password, sfOptions
    );

    // Aggregate query
    stream<SalesSummary, sql:Error?> summaryStream = sfClient->query(`
        SELECT
            region,
            product_category,
            SUM(revenue) AS total_revenue,
            COUNT(*) AS total_orders,
            AVG(revenue) AS avg_order_value
        FROM sales_transactions
        WHERE sale_date >= ${"2024-01-01"}
          AND sale_date < ${"2024-07-01"}
        GROUP BY region, product_category
        ORDER BY total_revenue DESC
    `);

    check from SalesSummary s in summaryStream
        do {
            io:println(string `${s.region} - ${s.product_category}: $${s.total_revenue}`);
        };

    check sfClient.close();
}
```

## Example 2: ETL Data Loading

```ballerina
type StageRecord record {|
    string customer_id;
    string name;
    string email;
    string region;
    string signup_date;
|};

function loadCustomerData(snowflake:Client sfClient,
                           StageRecord[] records) returns error? {
    // Create staging table
    _ = check sfClient->execute(`
        CREATE TABLE IF NOT EXISTS STAGING_DB.PUBLIC.CUSTOMERS_STAGE (
            CUSTOMER_ID VARCHAR(50),
            NAME VARCHAR(255),
            EMAIL VARCHAR(255),
            REGION VARCHAR(100),
            SIGNUP_DATE DATE
        )
    `);

    // Batch insert into staging
    sql:ParameterizedQuery[] insertQueries = from var r in records
        select `INSERT INTO STAGING_DB.PUBLIC.CUSTOMERS_STAGE
                (CUSTOMER_ID, NAME, EMAIL, REGION, SIGNUP_DATE)
                VALUES (${r.customer_id}, ${r.name}, ${r.email},
                        ${r.region}, ${r.signup_date})`;

    sql:ExecutionResult[] results = check sfClient->batchExecute(insertQueries);
    io:println(string `Loaded ${results.length()} records into staging`);

    // Merge from staging into production table
    _ = check sfClient->execute(`
        MERGE INTO PROD_DB.PUBLIC.CUSTOMERS AS target
        USING STAGING_DB.PUBLIC.CUSTOMERS_STAGE AS source
        ON target.CUSTOMER_ID = source.CUSTOMER_ID
        WHEN MATCHED THEN UPDATE SET
            target.NAME = source.NAME,
            target.EMAIL = source.EMAIL,
            target.REGION = source.REGION
        WHEN NOT MATCHED THEN INSERT
            (CUSTOMER_ID, NAME, EMAIL, REGION, SIGNUP_DATE)
            VALUES (source.CUSTOMER_ID, source.NAME, source.EMAIL,
                    source.REGION, source.SIGNUP_DATE)
    `);
    io:println("Merge completed");

    // Clean up staging
    _ = check sfClient->execute(`TRUNCATE TABLE STAGING_DB.PUBLIC.CUSTOMERS_STAGE`);
}
```

## Example 3: Analytics REST API

```ballerina
type MetricResult record {|
    string metric_name;
    decimal metric_value;
    string period;
|};

snowflake:Options sfOptions = {
    properties: {
        "warehouse": "ANALYTICS_WH",
        "db": "ANALYTICS_DB",
        "schema": "PUBLIC"
    }
};

final snowflake:Client sfClient = check new (
    accountIdentifier, user, password, sfOptions
);

service /analytics on new http:Listener(8080) {

    resource function get revenue(string period = "monthly")
            returns MetricResult[]|error {
        string dateFormat = period == "daily" ? "YYYY-MM-DD" : "YYYY-MM";
        stream<MetricResult, sql:Error?> resultStream = sfClient->query(
            `SELECT
                'revenue' AS metric_name,
                SUM(amount) AS metric_value,
                TO_CHAR(transaction_date, ${dateFormat}) AS period
             FROM transactions
             WHERE transaction_date >= DATEADD(month, -12, CURRENT_DATE())
             GROUP BY period
             ORDER BY period DESC`
        );
        return from MetricResult m in resultStream select m;
    }

    resource function get top\-products(int 'limit = 10)
            returns record {}[]|error {
        stream<record {}, sql:Error?> resultStream = sfClient->query(
            `SELECT product_name, SUM(quantity) AS total_sold,
                    SUM(revenue) AS total_revenue
             FROM sales
             GROUP BY product_name
             ORDER BY total_revenue DESC
             LIMIT ${'limit}`
        );
        return from var row in resultStream select row;
    }
}
```

## Example 4: Schema Management

```ballerina
function setupWarehouse(snowflake:Client sfClient) returns error? {
    // Create database and schema
    _ = check sfClient->execute(`CREATE DATABASE IF NOT EXISTS APP_DB`);
    _ = check sfClient->execute(`CREATE SCHEMA IF NOT EXISTS APP_DB.ANALYTICS`);

    // Create tables
    _ = check sfClient->execute(`
        CREATE TABLE IF NOT EXISTS APP_DB.ANALYTICS.EVENTS (
            EVENT_ID VARCHAR(50),
            EVENT_TYPE VARCHAR(100),
            USER_ID VARCHAR(50),
            PROPERTIES VARIANT,
            CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
        )
    `);

    _ = check sfClient->execute(`
        CREATE TABLE IF NOT EXISTS APP_DB.ANALYTICS.USER_SESSIONS (
            SESSION_ID VARCHAR(50),
            USER_ID VARCHAR(50),
            START_TIME TIMESTAMP_NTZ,
            END_TIME TIMESTAMP_NTZ,
            DURATION_SECONDS NUMBER,
            PAGE_VIEWS NUMBER
        )
    `);

    io:println("Warehouse schema setup complete");
}
```

## Example 5: Error Handling

```ballerina
function safeSnowflakeQuery(snowflake:Client sfClient,
                              string tableName) returns record {}[]|error {
    do {
        stream<record {}, sql:Error?> resultStream = sfClient->query(
            `SELECT * FROM ${tableName} LIMIT 100`
        );
        return from var row in resultStream select row;
    } on fail error e {
        if e is sql:DatabaseError {
            io:println("Snowflake error: ", e.message());
            io:println("Error code: ", e.detail().errorCode);
        }
        return error(string `Failed to query table ${tableName}`, e);
    }
}
```

## Example 6: Key-Pair Authentication

```ballerina
configurable string privateKeyPath = ?;
configurable string privateKeyPassphrase = ?;

public function main() returns error? {
    snowflake:AuthConfig authConfig = {
        user: user,
        privateKeyPath: privateKeyPath,
        privateKeyPassphrase: privateKeyPassphrase
    };

    snowflake:Options sfOptions = {
        properties: {
            "warehouse": "COMPUTE_WH",
            "db": "PROD_DB",
            "schema": "PUBLIC"
        }
    };

    snowflake:AdvancedClient sfClient = check new (
        accountIdentifier, authConfig, sfOptions
    );

    int rowCount = check sfClient->queryRow(
        `SELECT COUNT(*) FROM PROD_DB.PUBLIC.ORDERS`
    );
    io:println("Total orders: ", rowCount);

    check sfClient.close();
}
```

```toml
# Config.toml
accountIdentifier = "xy12345.us-east-1"
user = "service_account"
privateKeyPath = "./keys/rsa_key.p8"
privateKeyPassphrase = "my_passphrase"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
