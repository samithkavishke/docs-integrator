---
title: "Amazon SQS - Examples"
description: "Code examples for the ballerinax/aws.sqs connector."
---

# Amazon SQS Examples

## Example 1: Order processing with SQS

### Producer

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string queueUrl = ?;

final sqs:Client sqsClient = check new ({
    region: sqs:US_EAST_1,
    auth: { accessKeyId, secretAccessKey }
});

service /api on new http:Listener(8080) {
    resource function post orders(record {|string orderId; string item; int qty;|} order)
            returns http:Accepted|http:InternalServerError {
        do {
            sqs:SendMessageResponse resp = check sqsClient->sendMessage(
                queueUrl, order.toJsonString());
            log:printInfo("Order queued", messageId = resp.messageId);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Failed to queue order", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Consumer (polling)

```ballerina
import ballerina/log;
import ballerina/lang.runtime;
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string queueUrl = ?;

public function main() returns error? {
    sqs:Client sqsClient = check new ({
        region: sqs:US_EAST_1,
        auth: { accessKeyId, secretAccessKey }
    });

    while true {
        sqs:Message[] messages = check sqsClient->receiveMessage(queueUrl,
            maxNumberOfMessages = 10, waitTimeSeconds = 20);

        foreach var msg in messages {
            do {
                log:printInfo("Processing order", body = msg.body);
                check sqsClient->deleteMessage(queueUrl, msg.receiptHandle);
            } on fail error e {
                log:printError("Processing failed", 'error = e);
                // Message becomes visible again after visibility timeout
            }
        }
    }
}
```

## Example 2: FIFO queue for sequential processing

```ballerina
import ballerina/log;
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

public function main() returns error? {
    sqs:Client sqsClient = check new ({
        region: sqs:US_EAST_1,
        auth: { accessKeyId, secretAccessKey }
    });

    // Create a FIFO queue
    string fifoUrl = check sqsClient->createQueue("payment-events.fifo", {
        fifoQueue: true,
        contentBasedDeduplication: true
    });

    // Send ordered messages within a group
    check sqsClient->sendMessage(fifoUrl, "Payment initiated",
        messageGroupId = "txn-001");
    check sqsClient->sendMessage(fifoUrl, "Payment authorized",
        messageGroupId = "txn-001");
    check sqsClient->sendMessage(fifoUrl, "Payment captured",
        messageGroupId = "txn-001");

    log:printInfo("FIFO messages sent in order");
}
```

## Example 3: Batch operations

```ballerina
import ballerina/log;
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string queueUrl = ?;

public function main() returns error? {
    sqs:Client sqsClient = check new ({
        region: sqs:US_EAST_1,
        auth: { accessKeyId, secretAccessKey }
    });

    // Send batch
    sqs:SendMessageBatchEntry[] entries = [
        { id: "1", body: "Batch message 1" },
        { id: "2", body: "Batch message 2" },
        { id: "3", body: "Batch message 3", delaySeconds: 10 }
    ];
    sqs:SendMessageBatchResponse batchResp = check sqsClient->sendMessageBatch(
        queueUrl, entries);
    log:printInfo("Batch sent", count = batchResp.successful.length());

    // Receive and batch delete
    sqs:Message[] messages = check sqsClient->receiveMessage(queueUrl,
        maxNumberOfMessages = 10);

    if messages.length() > 0 {
        sqs:DeleteMessageBatchEntry[] delEntries = [];
        foreach int i in 0 ..< messages.length() {
            delEntries.push({ id: i.toString(), receiptHandle: messages[i].receiptHandle });
        }
        check sqsClient->deleteMessageBatch(queueUrl, delEntries);
        log:printInfo("Batch deleted", count = delEntries.length());
    }
}
```

## Example 4: Dead-letter queue configuration

```ballerina
import ballerina/log;
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

public function main() returns error? {
    sqs:Client sqsClient = check new ({
        region: sqs:US_EAST_1,
        auth: { accessKeyId, secretAccessKey }
    });

    // Create a DLQ
    string dlqUrl = check sqsClient->createQueue("orders-dlq");

    // Get DLQ ARN
    sqs:GetQueueAttributesResponse dlqAttrs = check sqsClient->getQueueAttributes(dlqUrl);

    // Create main queue with DLQ redrive policy
    string mainUrl = check sqsClient->createQueue("orders");
    check sqsClient->setQueueAttributes(mainUrl, {
        visibilityTimeout: 30,
        messageRetentionPeriod: 345600  // 4 days
    });

    log:printInfo("Queue with DLQ configured");
}
```

## Example 5: Config.toml

```toml
# Config.toml
accessKeyId = "AKIAIOSFODNN7EXAMPLE"
secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
queueUrl = "https://sqs.us-east-1.amazonaws.com/123456789/my-queue"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
