---
title: "AWS Lambda - Actions"
description: "Available actions and operations for the ballerinax/aws.lambda connector."
---

# AWS Lambda Actions

The `ballerinax/aws.lambda` package provides annotations and types for authoring AWS Lambda functions in Ballerina. Rather than a client-server model, this package turns your Ballerina code into Lambda-deployable functions.

## Function Annotation

### @aws.lambda:Function

Mark a function as a Lambda handler. The function must accept a `Context` and an event payload, and return a response or error.

```ballerina
import ballerinax/aws.lambda;

@aws.lambda:Function
public function myHandler(aws.lambda:Context ctx, json input) returns json|error {
    return {statusCode: 200, body: "OK"};
}
```

## Context API

The `aws.lambda:Context` object provides information about the Lambda execution environment.

### Get Request ID

```ballerina
@aws.lambda:Function
public function handler(aws.lambda:Context ctx, json input) returns json|error {
    string requestId = ctx.getRequestId();
    return {requestId: requestId};
}
```

### Get Function Name

```ballerina
string functionName = ctx.getFunctionName();
```

### Get Function Version

```ballerina
string version = ctx.getFunctionVersion();
```

### Get Remaining Execution Time

```ballerina
int remainingTimeMs = ctx.getRemainingExecutionTime();
```

### Get Memory Limit

```ballerina
int memoryLimitMB = ctx.getMemoryLimitInMB();
```

## Event Source Handlers

### API Gateway Proxy Event

Handle HTTP requests routed through API Gateway.

```ballerina
import ballerinax/aws.lambda;

type APIGatewayEvent record {
    string httpMethod;
    string path;
    map<string> headers?;
    map<string> queryStringParameters?;
    string body?;
};

type APIGatewayResponse record {
    int statusCode;
    map<string> headers?;
    string body;
};

@aws.lambda:Function
public function apiHandler(aws.lambda:Context ctx,
        APIGatewayEvent event) returns APIGatewayResponse|error {
    string method = event.httpMethod;
    string path = event.path;

    if method == "GET" && path == "/health" {
        return {
            statusCode: 200,
            headers: {"Content-Type": "application/json"},
            body: "{\"status\": \"healthy\"}"
        };
    }

    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: string `{"method": "${method}", "path": "${path}"}`
    };
}
```

### S3 Event Handler

Process S3 bucket notifications (object created, deleted, etc.).

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type S3Record record {
    record {
        record {string name;} bucket;
        record {string key; int size;} 'object;
    } s3;
    string eventName;
};

type S3Event record {
    S3Record[] Records;
};

@aws.lambda:Function
public function s3Handler(aws.lambda:Context ctx, S3Event event) returns json|error {
    foreach S3Record rec in event.Records {
        log:printInfo("S3 event received",
            event = rec.eventName,
            bucket = rec.s3.bucket.name,
            key = rec.s3.'object.key);
    }
    return {processed: event.Records.length()};
}
```

### SQS Event Handler

Process messages from Amazon SQS queues.

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type SQSRecord record {
    string messageId;
    string body;
    map<string> attributes;
};

type SQSEvent record {
    SQSRecord[] Records;
};

@aws.lambda:Function
public function sqsHandler(aws.lambda:Context ctx, SQSEvent event) returns json|error {
    foreach SQSRecord rec in event.Records {
        log:printInfo("Processing SQS message",
            messageId = rec.messageId, body = rec.body);
        // Process the message
    }
    return {processed: event.Records.length()};
}
```

### DynamoDB Stream Event Handler

React to DynamoDB table changes in real time.

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type DynamoDBRecord record {
    string eventName; // INSERT, MODIFY, REMOVE
    record {
        map<map<string>> NewImage?;
        map<map<string>> OldImage?;
    } dynamodb;
};

type DynamoDBStreamEvent record {
    DynamoDBRecord[] Records;
};

@aws.lambda:Function
public function dynamoHandler(aws.lambda:Context ctx,
        DynamoDBStreamEvent event) returns json|error {
    foreach DynamoDBRecord rec in event.Records {
        log:printInfo("DynamoDB stream event",
            eventType = rec.eventName);
    }
    return {processed: event.Records.length()};
}
```

## Error Handling

Lambda functions should handle errors gracefully and return appropriate responses.

```ballerina
@aws.lambda:Function
public function safeHandler(aws.lambda:Context ctx, json input) returns json|error {
    do {
        string name = check input.name;
        return {statusCode: 200, body: string `Hello, ${name}!`};
    } on fail error e {
        return {
            statusCode: 400,
            body: string `Error: ${e.message()}`
        };
    }
}
```

## Build and Deploy

Build your Lambda project:

```bash
bal build --cloud=lambda
```

The generated artifact at `target/aws-lambda.zip` can be deployed using the AWS CLI or any CI/CD pipeline.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
