---
title: "AWS Lambda - Examples"
description: "Code examples for the ballerinax/aws.lambda connector."
---

# AWS Lambda Examples

## Example 1: REST API with API Gateway

A complete CRUD API using Lambda functions fronted by API Gateway.

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type APIGatewayEvent record {
    string httpMethod;
    string path;
    map<string> pathParameters?;
    map<string> queryStringParameters?;
    string body?;
    map<string> headers?;
};

type APIGatewayResponse record {
    int statusCode;
    map<string> headers;
    string body;
};

// In-memory store (resets between cold starts)
map<json> itemStore = {};

@aws.lambda:Function
public function apiRouter(aws.lambda:Context ctx,
        APIGatewayEvent event) returns APIGatewayResponse|error {

    map<string> corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    string method = event.httpMethod;
    log:printInfo("Request received", method = method, path = event.path);

    match method {
        "GET" => {
            map<string>? params = event.queryStringParameters;
            string? id = params is map<string> ? params["id"] : ();
            if id is string && itemStore.hasKey(id) {
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: itemStore.get(id).toJsonString()
                };
            }
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: itemStore.toJsonString()
            };
        }
        "POST" => {
            if event.body is string {
                json payload = check (<string>event.body).fromJsonString();
                string id = check payload.id;
                itemStore[id] = payload;
                return {
                    statusCode: 201,
                    headers: corsHeaders,
                    body: string `{"id": "${id}", "status": "created"}`
                };
            }
            return {statusCode: 400, headers: corsHeaders, body: "{\"error\": \"No body\"}"};
        }
        "DELETE" => {
            map<string>? params = event.queryStringParameters;
            string? id = params is map<string> ? params["id"] : ();
            if id is string {
                _ = itemStore.remove(id);
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: string `{"id": "${id}", "status": "deleted"}`
                };
            }
            return {statusCode: 400, headers: corsHeaders, body: "{\"error\": \"Missing id\"}"};
        }
    }

    return {statusCode: 405, headers: corsHeaders, body: "{\"error\": \"Method not allowed\"}"};
}
```

## Example 2: S3 Image Processing Pipeline

Process images uploaded to S3 by creating metadata records.

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type S3EventRecord record {
    string eventName;
    record {
        record {string name;} bucket;
        record {
            string key;
            int size;
        } 'object;
    } s3;
    string eventTime;
};

type S3Event record {
    S3EventRecord[] Records;
};

@aws.lambda:Function
public function imageProcessor(aws.lambda:Context ctx,
        S3Event event) returns json|error {

    json[] processedItems = [];

    foreach S3EventRecord rec in event.Records {
        string bucket = rec.s3.bucket.name;
        string key = rec.s3.'object.key;
        int size = rec.s3.'object.size;

        // Check if the file is an image
        boolean isImage = key.endsWith(".jpg") ||
                          key.endsWith(".png") ||
                          key.endsWith(".gif") ||
                          key.endsWith(".webp");

        if isImage {
            log:printInfo("Processing image",
                bucket = bucket, key = key, sizeBytes = size);

            // Extract file metadata
            string fileName = key.substring(key.lastIndexOf("/") + 1);
            string extension = key.substring(key.lastIndexOf(".") + 1);

            json metadata = {
                fileName: fileName,
                extension: extension,
                bucket: bucket,
                key: key,
                sizeBytes: size,
                processedAt: rec.eventTime,
                requestId: ctx.getRequestId()
            };

            processedItems.push(metadata);
            log:printInfo("Image metadata extracted", fileName = fileName);
        } else {
            log:printInfo("Skipping non-image file", key = key);
        }
    }

    return {
        statusCode: 200,
        processed: processedItems.length(),
        items: processedItems
    };
}
```

## Example 3: SQS Message Processor

Process messages from an SQS queue for order fulfillment.

```ballerina
import ballerinax/aws.lambda;
import ballerina/log;

type SQSRecord record {
    string messageId;
    string body;
    string receiptHandle;
    map<string> attributes;
};

type SQSEvent record {
    SQSRecord[] Records;
};

type OrderMessage record {
    string orderId;
    string customerId;
    string productId;
    int quantity;
    decimal unitPrice;
};

@aws.lambda:Function
public function orderProcessor(aws.lambda:Context ctx,
        SQSEvent event) returns json|error {

    int successCount = 0;
    int failCount = 0;

    foreach SQSRecord rec in event.Records {
        do {
            OrderMessage order = check rec.body.fromJsonStringWithType();

            decimal totalAmount = order.unitPrice * <decimal>order.quantity;

            log:printInfo("Processing order",
                orderId = order.orderId,
                customerId = order.customerId,
                total = totalAmount);

            // Business logic: validate inventory, charge payment, etc.
            if order.quantity <= 0 {
                log:printError("Invalid quantity", orderId = order.orderId);
                failCount += 1;
                continue;
            }

            // Mark as processed
            successCount += 1;
            log:printInfo("Order processed successfully",
                orderId = order.orderId);
        } on fail error e {
            failCount += 1;
            log:printError("Failed to process message",
                messageId = rec.messageId, 'error = e);
        }
    }

    return {
        batchItemFailures: [],
        summary: {
            total: event.Records.length(),
            success: successCount,
            failed: failCount
        }
    };
}
```

## Example 4: Scheduled Health Check

A Lambda function triggered by EventBridge (CloudWatch Events) to perform health checks.

```ballerina
import ballerinax/aws.lambda;
import ballerina/http;
import ballerina/log;
import ballerina/time;

type ScheduledEvent record {
    string 'source;
    string detail\-type;
    json detail;
    string time;
};

type HealthCheckResult record {
    string endpoint;
    int statusCode;
    int responseTimeMs;
    boolean healthy;
};

@aws.lambda:Function
public function healthChecker(aws.lambda:Context ctx,
        ScheduledEvent event) returns json|error {

    string[] endpoints = [
        "https://api.example.com/health",
        "https://auth.example.com/health",
        "https://payments.example.com/health"
    ];

    HealthCheckResult[] results = [];

    foreach string endpoint in endpoints {
        do {
            http:Client httpClient = check new (endpoint);
            time:Utc startTime = time:utcNow();

            http:Response response = check httpClient->get("/");
            time:Utc endTime = time:utcNow();

            decimal elapsed = time:utcDiffInSeconds(endTime, startTime);
            int responseTimeMs = <int>(elapsed * 1000d);

            results.push({
                endpoint: endpoint,
                statusCode: response.statusCode,
                responseTimeMs: responseTimeMs,
                healthy: response.statusCode == 200
            });
        } on fail error e {
            log:printError("Health check failed",
                endpoint = endpoint, 'error = e);
            results.push({
                endpoint: endpoint,
                statusCode: 0,
                responseTimeMs: -1,
                healthy: false
            });
        }
    }

    int healthyCount = results.filter(r => r.healthy).length();
    string timestamp = time:utcToString(time:utcNow());

    log:printInfo("Health check completed",
        healthy = healthyCount, total = results.length());

    return {
        timestamp: timestamp,
        results: results,
        allHealthy: healthyCount == results.length()
    };
}
```

## Build and Deploy

For all examples above, build with:

```bash
bal build --cloud=lambda
```

Deploy using AWS CLI:

```bash
aws lambda create-function \
    --function-name my-function \
    --runtime provided.al2 \
    --handler function.handler \
    --role arn:aws:iam::123456789012:role/lambda-role \
    --zip-file fileb://target/aws-lambda.zip
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
