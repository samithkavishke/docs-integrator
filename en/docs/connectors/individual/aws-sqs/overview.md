---
title: "Amazon SQS"
description: "Overview of the ballerinax/aws.sqs connector for WSO2 Integrator."
---

# Amazon SQS

| | |
|---|---|
| **Package** | [`ballerinax/aws.sqs`](https://central.ballerina.io/ballerinax/aws.sqs/latest) |
| **Version** | 4.1.1 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.sqs/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.sqs/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-aws.sqs) |

## Overview

The `ballerinax/aws.sqs` package provides APIs to interact with Amazon Simple Queue Service (SQS), a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.

### Key capabilities

- **Standard queues**: At-least-once delivery with best-effort ordering and nearly unlimited throughput
- **FIFO queues**: Exactly-once processing with strict message ordering
- **Batch operations**: Send, receive, and delete messages in batches for higher throughput
- **Queue management**: Create, configure, list, and delete queues programmatically
- **Visibility timeout**: Control how long received messages are invisible to other consumers
- **Dead-letter queues**: Automatically move messages that fail processing after a configurable number of retries
- **Message attributes**: Attach custom metadata to messages

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.sqs"
version = "4.1.1"
```

```ballerina
import ballerinax/aws.sqs;
import ballerina/log;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

public function main() returns error? {
    sqs:Client sqsClient = check new ({
        region: sqs:US_EAST_1,
        auth: { accessKeyId, secretAccessKey }
    });

    // Create a queue
    string queueUrl = check sqsClient->createQueue("my-queue");

    // Send a message
    sqs:SendMessageResponse resp = check sqsClient->sendMessage(queueUrl,
        "Hello from Ballerina!");
    log:printInfo("Message sent", messageId = resp.messageId);

    // Receive messages
    sqs:Message[] messages = check sqsClient->receiveMessage(queueUrl);
    foreach var msg in messages {
        log:printInfo("Received", body = msg.body);
        check sqsClient->deleteMessage(queueUrl, msg.receiptHandle);
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/aws.sqs/latest)
