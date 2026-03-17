---
title: "Azure Functions - Actions"
description: "Available triggers and bindings for the ballerinax/azure.functions connector."
---

# Azure Functions Actions

The `ballerinax/azure.functions` module uses annotations to define triggers and bindings. Functions are declared as Ballerina services with specific annotations that map to Azure Functions trigger types.

## HTTP Trigger and Output

Handle HTTP requests as serverless endpoints.

### Basic HTTP Function

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "anonymous"}
service /api on new functions:HTTPListener() {
    resource function get greeting(string name) returns string {
        return "Hello, " + name + "!";
    }

    resource function post echo(@http:Payload json payload) returns json {
        return payload;
    }
}
```

### HTTP with Custom Response

```ballerina
import ballerina/http;
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "function"}
service /orders on new functions:HTTPListener() {
    resource function get [string orderId]() returns http:Ok|http:NotFound {
        return <http:Ok>{body: {orderId: orderId, status: "shipped"}};
    }
}
```

## Queue Trigger and Output

### Process Queue Messages

React to messages arriving in an Azure Storage Queue.

```ballerina
import ballerina/log;
import ballerinax/azure.functions;

@functions:QueueTrigger {queueName: "incoming-orders"}
listener functions:QueueListener queueListener = new ();

service on queueListener {
    remote function onMessage(string message) returns error? {
        log:printInfo("Queue message received", content = message);
    }
}
```

### Send to Queue (Output Binding)

Write messages to a queue from an HTTP-triggered function.

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "anonymous"}
service /enqueue on new functions:HTTPListener() {
    @functions:QueueOutput {queueName: "outgoing-notifications"}
    resource function post .(string message) returns string {
        return message;
    }
}
```

## Blob Trigger, Input, and Output

### React to Blob Uploads

Execute a function when a new blob is uploaded to a container.

```ballerina
import ballerina/log;
import ballerinax/azure.functions;

@functions:BlobTrigger {path: "uploads/{name}"}
listener functions:BlobListener blobListener = new ();

service on blobListener {
    remote function onUpdate(byte[] blob, string name) returns error? {
        log:printInfo("Blob uploaded", blobName = name, size = blob.length());
    }
}
```

### Read and Write Blobs

Read from one blob container and write to another.

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "anonymous"}
service /process on new functions:HTTPListener() {
    @functions:BlobInput {path: "input/{fileName}", connection: "AzureWebJobsStorage"}
    @functions:BlobOutput {path: "output/{fileName}", connection: "AzureWebJobsStorage"}
    resource function post .(byte[] inputBlob, string fileName) returns byte[] {
        return inputBlob;
    }
}
```

## Timer Trigger

Execute functions on a schedule using CRON expressions.

```ballerina
import ballerina/log;
import ballerinax/azure.functions;

@functions:TimerTrigger {schedule: "0 */5 * * * *"}
listener functions:TimerListener timerListener = new ();

service on timerListener {
    remote function onTrigger(functions:TimerMetadata metadata) returns error? {
        log:printInfo("Timer triggered at scheduled time");
    }
}
```

## Cosmos DB Trigger, Input, and Output

### React to Cosmos DB Changes

Process new or updated documents in a Cosmos DB container.

```ballerina
import ballerina/log;
import ballerinax/azure.functions;

@functions:CosmosDBTrigger {
    connectionStringSetting: "CosmosDBConnection",
    databaseName: "mydb",
    collectionName: "orders"
}
listener functions:CosmosDBListener cosmosListener = new ();

service on cosmosListener {
    remote function onUpdate(json[] documents) returns error? {
        foreach json doc in documents {
            log:printInfo("Document changed", doc = doc);
        }
    }
}
```

### Cosmos DB Input and Output Bindings

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "anonymous"}
service /items on new functions:HTTPListener() {
    @functions:CosmosDBInput {
        connectionStringSetting: "CosmosDBConnection",
        databaseName: "mydb",
        collectionName: "items",
        sqlQuery: "SELECT * FROM c WHERE c.status = 'active'"
    }
    resource function get active(json[] items) returns json {
        return items;
    }

    @functions:CosmosDBOutput {
        connectionStringSetting: "CosmosDBConnection",
        databaseName: "mydb",
        collectionName: "items"
    }
    resource function post .(@http:Payload json item) returns json {
        return item;
    }
}
```

## Twilio Output Binding

Send SMS notifications from any function trigger.

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "function"}
service /notify on new functions:HTTPListener() {
    @functions:TwilioSmsOutput {
        accountSidSetting: "TwilioAccountSid",
        authTokenSetting: "TwilioAuthToken",
        'from: "+1234567890"
    }
    resource function post sms(string to, string body) returns functions:TwilioSmsMessage {
        return {to: to, body: body};
    }
}
```

## Deployment

Build and deploy to Azure:

```bash
bal build
func azure functionapp publish <function-app-name>
```

## Error Handling

All trigger functions can return `error?`. Return an error to signal failure and trigger retries (for queue and Cosmos DB triggers):

```ballerina
import ballerina/log;

service on queueListener {
    remote function onMessage(string message) returns error? {
        do {
            // Process message
        } on fail error e {
            log:printError("Processing failed", 'error = e);
            return e;
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/azure.functions/4.2.0)
