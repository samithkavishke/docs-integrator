---
title: "Amazon DynamoDB - Actions"
description: "Available actions and operations for the ballerinax/aws.dynamodb connector."
---

# Amazon DynamoDB Actions

The `ballerinax/aws.dynamodb` package provides a comprehensive client for interacting with Amazon DynamoDB tables and items.

## Client Initialization

```ballerina
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

dynamodb:Client dynamoClient = check new ({
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
});
```

## Table Operations

### Create Table

Create a new DynamoDB table with a specified key schema and throughput settings.

```ballerina
dynamodb:TableCreateInput tableInput = {
    tableName: "Orders",
    keySchema: [
        {attributeName: "customerId", keyType: "HASH"},
        {attributeName: "orderId", keyType: "RANGE"}
    ],
    attributeDefinitions: [
        {attributeName: "customerId", attributeType: "S"},
        {attributeName: "orderId", attributeType: "S"}
    ],
    provisionedThroughput: {
        readCapacityUnits: 5,
        writeCapacityUnits: 5
    }
};

dynamodb:TableCreateOutput result = check dynamoClient->createTable(tableInput);
io:println("Table created: ", result.tableDescription?.tableName);
```

### Describe Table

Get details about a table including its status, key schema, and throughput.

```ballerina
dynamodb:TableDescribeOutput tableInfo = check dynamoClient->describeTable("Orders");
io:println("Status: ", tableInfo.table?.tableStatus);
io:println("Item count: ", tableInfo.table?.itemCount);
```

### List Tables

List all DynamoDB tables in the configured region.

```ballerina
dynamodb:TableList tables = check dynamoClient->listTables();
foreach string tableName in tables.tableNames {
    io:println("Table: ", tableName);
}
```

### Delete Table

Delete a DynamoDB table and all of its data.

```ballerina
dynamodb:TableDeleteOutput deleteResult = check dynamoClient->deleteTable("Orders");
io:println("Deleted table: ", deleteResult.tableDescription?.tableName);
```

## Item Operations

### Put Item

Insert or replace an item in a table. Each item is a map of attribute names to attribute values.

```ballerina
dynamodb:ItemCreateInput putInput = {
    tableName: "Orders",
    item: {
        "customerId": {"S": "CUST-001"},
        "orderId": {"S": "ORD-2024-001"},
        "productName": {"S": "Widget Pro"},
        "quantity": {"N": "5"},
        "totalAmount": {"N": "149.95"},
        "status": {"S": "PENDING"}
    }
};

_ = check dynamoClient->createItem(putInput);
```

### Get Item

Retrieve a single item by its primary key.

```ballerina
dynamodb:ItemGetInput getInput = {
    tableName: "Orders",
    key: {
        "customerId": {"S": "CUST-001"},
        "orderId": {"S": "ORD-2024-001"}
    }
};

dynamodb:ItemGetOutput getResult = check dynamoClient->getItem(getInput);
map<dynamodb:AttributeValue>? item = getResult.item;
if item is map<dynamodb:AttributeValue> {
    io:println("Product: ", item["productName"]);
    io:println("Status: ", item["status"]);
}
```

### Update Item

Update specific attributes of an existing item using update expressions.

```ballerina
dynamodb:ItemUpdateInput updateInput = {
    tableName: "Orders",
    key: {
        "customerId": {"S": "CUST-001"},
        "orderId": {"S": "ORD-2024-001"}
    },
    updateExpression: "SET #s = :newStatus, quantity = :newQty",
    expressionAttributeNames: {"#s": "status"},
    expressionAttributeValues: {
        ":newStatus": {"S": "SHIPPED"},
        ":newQty": {"N": "10"}
    }
};

_ = check dynamoClient->updateItem(updateInput);
```

### Delete Item

Remove an item from a table by its primary key.

```ballerina
dynamodb:ItemDeleteInput deleteInput = {
    tableName: "Orders",
    key: {
        "customerId": {"S": "CUST-001"},
        "orderId": {"S": "ORD-2024-001"}
    }
};

_ = check dynamoClient->deleteItem(deleteInput);
```

## Query Operations

### Query

Retrieve items matching a partition key value with optional sort key conditions.

```ballerina
dynamodb:QueryInput queryInput = {
    tableName: "Orders",
    keyConditionExpression: "customerId = :custId AND begins_with(orderId, :prefix)",
    expressionAttributeValues: {
        ":custId": {"S": "CUST-001"},
        ":prefix": {"S": "ORD-2024"}
    }
};

dynamodb:QueryOutput queryResult = check dynamoClient->query(queryInput);
io:println("Found ", queryResult.count, " orders");
foreach map<dynamodb:AttributeValue> item in queryResult.items {
    io:println("  Order: ", item["orderId"], " Status: ", item["status"]);
}
```

**Query with filter expression:**

```ballerina
dynamodb:QueryInput filteredQuery = {
    tableName: "Orders",
    keyConditionExpression: "customerId = :custId",
    filterExpression: "#s = :statusVal",
    expressionAttributeNames: {"#s": "status"},
    expressionAttributeValues: {
        ":custId": {"S": "CUST-001"},
        ":statusVal": {"S": "SHIPPED"}
    }
};

dynamodb:QueryOutput filteredResult = check dynamoClient->query(filteredQuery);
```

### Scan

Perform a full table scan with optional filter expressions.

```ballerina
dynamodb:ScanInput scanInput = {
    tableName: "Orders",
    filterExpression: "totalAmount > :minAmount",
    expressionAttributeValues: {
        ":minAmount": {"N": "100"}
    }
};

dynamodb:ScanOutput scanResult = check dynamoClient->scan(scanInput);
io:println("Found ", scanResult.count, " high-value orders");
```

## Batch Operations

### Batch Write Item

Write or delete up to 25 items across one or more tables in a single request.

```ballerina
dynamodb:BatchWriteItemInput batchInput = {
    requestItems: {
        "Orders": [
            {
                putRequest: {
                    item: {
                        "customerId": {"S": "CUST-002"},
                        "orderId": {"S": "ORD-2024-010"},
                        "productName": {"S": "Gadget X"},
                        "quantity": {"N": "2"},
                        "totalAmount": {"N": "59.98"}
                    }
                }
            },
            {
                putRequest: {
                    item: {
                        "customerId": {"S": "CUST-002"},
                        "orderId": {"S": "ORD-2024-011"},
                        "productName": {"S": "Gadget Y"},
                        "quantity": {"N": "1"},
                        "totalAmount": {"N": "29.99"}
                    }
                }
            }
        ]
    }
};

dynamodb:BatchWriteItemOutput batchResult = check dynamoClient->batchWriteItem(batchInput);
```

## Error Handling

```ballerina
import ballerina/log;

do {
    dynamodb:ItemGetOutput result = check dynamoClient->getItem({
        tableName: "Orders",
        key: {"customerId": {"S": "CUST-999"}, "orderId": {"S": "ORD-000"}}
    });
} on fail error e {
    log:printError("DynamoDB operation failed", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause | Resolution |
|---|---|---|
| `ResourceNotFoundException` | Table does not exist | Verify table name and region |
| `ConditionalCheckFailedException` | Condition expression not met | Review condition logic |
| `ProvisionedThroughputExceededException` | Exceeded read/write capacity | Increase capacity or use on-demand |
| `ValidationException` | Invalid request parameters | Check attribute types and expressions |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
