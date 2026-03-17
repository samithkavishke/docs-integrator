---
title: "Azure Functions - Examples"
description: "Code examples for the ballerinax/azure.functions connector."
---

# Azure Functions Examples

## Example 1: Serverless REST API

Deploy a complete CRUD API as an Azure Function with HTTP triggers.

```ballerina
import ballerina/http;
import ballerina/uuid;
import ballerinax/azure.functions;

type Product record {|
    string id;
    string name;
    decimal price;
    string category;
|};

map<Product> products = {};

@functions:HTTPTrigger {authLevel: "anonymous"}
service /api/products on new functions:HTTPListener() {

    resource function get .() returns Product[] {
        return products.toArray();
    }

    resource function get [string id]() returns Product|http:NotFound {
        Product? product = products[id];
        if product is () {
            return http:NOT_FOUND;
        }
        return product;
    }

    resource function post .(@http:Payload Product product) returns http:Created {
        string id = uuid:createType1AsString();
        Product newProduct = {...product, id: id};
        products[id] = newProduct;
        return <http:Created>{body: newProduct};
    }

    resource function delete [string id]() returns http:NoContent|http:NotFound {
        if products.hasKey(id) {
            _ = products.remove(id);
            return http:NO_CONTENT;
        }
        return http:NOT_FOUND;
    }
}
```

## Example 2: Queue-Triggered Order Processor

Process orders from a Storage Queue and write results to Cosmos DB.

```ballerina
import ballerina/log;
import ballerina/time;
import ballerinax/azure.functions;

type Order record {|
    string orderId;
    string customerId;
    string[] items;
    decimal total;
|};

type ProcessedOrder record {|
    string id;
    string orderId;
    string customerId;
    string status;
    string processedAt;
    decimal total;
|};

@functions:QueueTrigger {queueName: "new-orders"}
listener functions:QueueListener orderQueue = new ();

service on orderQueue {
    @functions:CosmosDBOutput {
        connectionStringSetting: "CosmosDBConnection",
        databaseName: "shop",
        collectionName: "processed-orders"
    }
    remote function onMessage(string message) returns ProcessedOrder|error? {
        json orderJson = check message.fromJsonString();
        Order order = check orderJson.cloneWithType();

        log:printInfo("Processing order", orderId = order.orderId);

        ProcessedOrder processed = {
            id: order.orderId,
            orderId: order.orderId,
            customerId: order.customerId,
            status: "processed",
            processedAt: time:utcToString(time:utcNow()),
            total: order.total
        };

        log:printInfo("Order processed", orderId = order.orderId);
        return processed;
    }
}
```

## Example 3: Scheduled Data Cleanup

Run a periodic cleanup function every hour using a timer trigger.

```ballerina
import ballerina/log;
import ballerina/time;
import ballerinax/azure.functions;

@functions:TimerTrigger {schedule: "0 0 * * * *"}
listener functions:TimerListener cleanupTimer = new ();

service on cleanupTimer {
    remote function onTrigger(functions:TimerMetadata metadata) returns error? {
        string currentTime = time:utcToString(time:utcNow());
        log:printInfo("Cleanup started", timestamp = currentTime);

        // Simulate cleanup of expired sessions
        int expiredCount = check cleanupExpiredSessions();
        log:printInfo("Cleanup completed", expiredSessions = expiredCount);
    }
}

function cleanupExpiredSessions() returns int|error {
    // Cleanup logic here
    return 42;
}
```

## Example 4: Blob-Triggered Image Processing Pipeline

React to image uploads and generate metadata in a separate container.

```ballerina
import ballerina/log;
import ballerina/time;
import ballerinax/azure.functions;

type ImageMetadata record {|
    string fileName;
    int sizeBytes;
    string uploadedAt;
    string status;
|};

@functions:BlobTrigger {path: "images/{name}"}
listener functions:BlobListener imageListener = new ();

service on imageListener {
    @functions:BlobOutput {path: "metadata/{name}.json", connection: "AzureWebJobsStorage"}
    remote function onUpdate(byte[] blob, string name) returns string|error? {
        log:printInfo("Image uploaded", fileName = name, sizeBytes = blob.length());

        ImageMetadata metadata = {
            fileName: name,
            sizeBytes: blob.length(),
            uploadedAt: time:utcToString(time:utcNow()),
            status: "processed"
        };

        return metadata.toJsonString();
    }
}
```

## Example 5: HTTP Gateway with Queue Backend

Accept HTTP requests and offload processing to a queue for async execution.

```ballerina
import ballerina/http;
import ballerina/uuid;
import ballerinax/azure.functions;

type TaskRequest record {|
    string taskType;
    json payload;
|};

type TaskResponse record {|
    string taskId;
    string status;
    string message;
|};

@functions:HTTPTrigger {authLevel: "function"}
service /api/tasks on new functions:HTTPListener() {
    @functions:QueueOutput {queueName: "task-queue"}
    resource function post .(@http:Payload TaskRequest request) returns TaskResponse {
        string taskId = uuid:createType1AsString();
        return {
            taskId: taskId,
            status: "queued",
            message: "Task " + request.taskType + " has been queued for processing"
        };
    }
}
```

## Build and Deploy

```bash
# Build the Ballerina project
bal build

# Deploy to Azure using the Azure Functions Core Tools
func azure functionapp publish my-function-app

# Verify deployment
curl https://my-function-app.azurewebsites.net/api/products
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
