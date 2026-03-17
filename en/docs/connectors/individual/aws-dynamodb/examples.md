---
title: "Amazon DynamoDB - Examples"
description: "Code examples for the ballerinax/aws.dynamodb connector."
---

# Amazon DynamoDB Examples

## Example 1: Order Management REST API

Build a complete order management service backed by DynamoDB.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/uuid;
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

const string ORDERS_TABLE = "Orders";

final dynamodb:Client dynamoClient = check new ({
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
});

type OrderRequest record {
    string customerId;
    string productName;
    int quantity;
    decimal unitPrice;
};

service /orders on new http:Listener(8080) {

    // Create a new order
    resource function post .(OrderRequest orderReq) returns json|error {
        string orderId = uuid:createType1AsString();
        decimal total = orderReq.unitPrice * <decimal>orderReq.quantity;

        _ = check dynamoClient->createItem({
            tableName: ORDERS_TABLE,
            item: {
                "customerId": {"S": orderReq.customerId},
                "orderId": {"S": orderId},
                "productName": {"S": orderReq.productName},
                "quantity": {"N": orderReq.quantity.toString()},
                "unitPrice": {"N": orderReq.unitPrice.toString()},
                "totalAmount": {"N": total.toString()},
                "status": {"S": "CREATED"}
            }
        });

        log:printInfo("Order created", orderId = orderId);
        return {orderId: orderId, status: "CREATED", total: total};
    }

    // Get orders for a customer
    resource function get customer/[string customerId]() returns json|error {
        dynamodb:QueryOutput result = check dynamoClient->query({
            tableName: ORDERS_TABLE,
            keyConditionExpression: "customerId = :cid",
            expressionAttributeValues: {
                ":cid": {"S": customerId}
            }
        });

        json[] orders = [];
        foreach map<dynamodb:AttributeValue> item in result.items {
            orders.push({
                orderId: item["orderId"]?.S,
                productName: item["productName"]?.S,
                quantity: item["quantity"]?.N,
                totalAmount: item["totalAmount"]?.N,
                status: item["status"]?.S
            });
        }
        return {customerId: customerId, orders: orders};
    }

    // Update order status
    resource function put [string customerId]/[string orderId](
            record {string status;} payload) returns json|error {
        _ = check dynamoClient->updateItem({
            tableName: ORDERS_TABLE,
            key: {
                "customerId": {"S": customerId},
                "orderId": {"S": orderId}
            },
            updateExpression: "SET #s = :newStatus",
            expressionAttributeNames: {"#s": "status"},
            expressionAttributeValues: {
                ":newStatus": {"S": payload.status}
            }
        });

        return {orderId: orderId, status: payload.status};
    }
}
```

**Config.toml:**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
```

## Example 2: IoT Sensor Data Ingestion

Ingest and query time-series sensor data from IoT devices.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

const string SENSOR_TABLE = "SensorData";

final dynamodb:Client dynamoClient = check new ({
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
});

type SensorReading record {
    string deviceId;
    float temperature;
    float humidity;
    float pressure;
};

service /iot on new http:Listener(8080) {

    // Ingest sensor data
    resource function post readings(SensorReading reading) returns json|error {
        string timestamp = time:utcToString(time:utcNow());

        _ = check dynamoClient->createItem({
            tableName: SENSOR_TABLE,
            item: {
                "deviceId": {"S": reading.deviceId},
                "timestamp": {"S": timestamp},
                "temperature": {"N": reading.temperature.toString()},
                "humidity": {"N": reading.humidity.toString()},
                "pressure": {"N": reading.pressure.toString()}
            }
        });

        log:printInfo("Sensor data recorded",
            deviceId = reading.deviceId, timestamp = timestamp);
        return {status: "recorded", timestamp: timestamp};
    }

    // Batch ingest multiple readings
    resource function post batch(SensorReading[] readings) returns json|error {
        dynamodb:BatchWriteItemInputItem[] writeRequests = [];

        foreach SensorReading reading in readings {
            string timestamp = time:utcToString(time:utcNow());
            writeRequests.push({
                putRequest: {
                    item: {
                        "deviceId": {"S": reading.deviceId},
                        "timestamp": {"S": timestamp},
                        "temperature": {"N": reading.temperature.toString()},
                        "humidity": {"N": reading.humidity.toString()},
                        "pressure": {"N": reading.pressure.toString()}
                    }
                }
            });
        }

        _ = check dynamoClient->batchWriteItem({
            requestItems: {[SENSOR_TABLE] : writeRequests}
        });

        return {status: "batch_recorded", count: readings.length()};
    }

    // Query readings for a device within a time range
    resource function get readings/[string deviceId](
            string startTime, string endTime) returns json|error {
        dynamodb:QueryOutput result = check dynamoClient->query({
            tableName: SENSOR_TABLE,
            keyConditionExpression:
                "deviceId = :did AND #ts BETWEEN :start AND :end",
            expressionAttributeNames: {"#ts": "timestamp"},
            expressionAttributeValues: {
                ":did": {"S": deviceId},
                ":start": {"S": startTime},
                ":end": {"S": endTime}
            }
        });

        json[] readings = [];
        foreach map<dynamodb:AttributeValue> item in result.items {
            readings.push({
                timestamp: item["timestamp"]?.S,
                temperature: item["temperature"]?.N,
                humidity: item["humidity"]?.N,
                pressure: item["pressure"]?.N
            });
        }

        return {deviceId: deviceId, readings: readings};
    }
}
```

## Example 3: Configuration Store with Caching

Use DynamoDB as a centralized configuration store with local caching.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

const string CONFIG_TABLE = "AppConfig";

final dynamodb:Client dynamoClient = check new ({
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
});

// In-memory cache for configuration values
map<string> configCache = {};

// Get a configuration value
function getConfig(string namespace, string key) returns string|error {
    string cacheKey = string `${namespace}:${key}`;
    if configCache.hasKey(cacheKey) {
        return configCache.get(cacheKey);
    }

    dynamodb:ItemGetOutput result = check dynamoClient->getItem({
        tableName: CONFIG_TABLE,
        key: {
            "namespace": {"S": namespace},
            "configKey": {"S": key}
        }
    });

    map<dynamodb:AttributeValue>? item = result.item;
    if item is map<dynamodb:AttributeValue> {
        string value = item["configValue"]?.S ?: "";
        configCache[cacheKey] = value;
        return value;
    }
    return error("Configuration not found: " + cacheKey);
}

// Set a configuration value
function setConfig(string namespace, string key, string value) returns error? {
    _ = check dynamoClient->createItem({
        tableName: CONFIG_TABLE,
        item: {
            "namespace": {"S": namespace},
            "configKey": {"S": key},
            "configValue": {"S": value}
        }
    });

    string cacheKey = string `${namespace}:${key}`;
    configCache[cacheKey] = value;
    log:printInfo("Config updated", namespace = namespace, key = key);
}

public function main() returns error? {
    // Set configuration values
    check setConfig("payment", "currency", "USD");
    check setConfig("payment", "maxRetries", "3");
    check setConfig("email", "smtpHost", "smtp.example.com");

    // Read configuration values
    string currency = check getConfig("payment", "currency");
    string maxRetries = check getConfig("payment", "maxRetries");
    io:println("Currency: ", currency, " | Max retries: ", maxRetries);
}
```

## Example 4: Table Initialization and Data Migration

Create tables programmatically and migrate data between them.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/lang.runtime;
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

final dynamodb:Client dynamoClient = check new ({
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
});

function createTableIfNotExists(string tableName,
        dynamodb:TableCreateInput tableInput) returns error? {
    // Check if table exists
    do {
        _ = check dynamoClient->describeTable(tableName);
        log:printInfo("Table already exists", tableName = tableName);
    } on fail error e {
        log:printInfo("Creating table", tableName = tableName);
        _ = check dynamoClient->createTable(tableInput);

        // Wait for table to become active
        boolean active = false;
        while !active {
            runtime:sleep(2);
            dynamodb:TableDescribeOutput desc =
                check dynamoClient->describeTable(tableName);
            if desc.table?.tableStatus == "ACTIVE" {
                active = true;
            }
        }
        log:printInfo("Table created and active", tableName = tableName);
    }
}

public function main() returns error? {
    // Create Users table
    check createTableIfNotExists("Users", {
        tableName: "Users",
        keySchema: [
            {attributeName: "userId", keyType: "HASH"}
        ],
        attributeDefinitions: [
            {attributeName: "userId", attributeType: "S"}
        ],
        provisionedThroughput: {
            readCapacityUnits: 10,
            writeCapacityUnits: 5
        }
    });

    // Seed initial data
    string[][] users = [
        ["U001", "Alice", "alice@example.com"],
        ["U002", "Bob", "bob@example.com"],
        ["U003", "Charlie", "charlie@example.com"]
    ];

    foreach string[] user in users {
        _ = check dynamoClient->createItem({
            tableName: "Users",
            item: {
                "userId": {"S": user[0]},
                "name": {"S": user[1]},
                "email": {"S": user[2]}
            }
        });
    }

    io:println("Table initialized with ", users.length(), " users");
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
