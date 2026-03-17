---
title: "Amazon SQS - Actions"
description: "Available actions and operations for the ballerinax/aws.sqs connector."
---

# Amazon SQS Actions

The `ballerinax/aws.sqs` package provides a Client for queue management and message operations.

## Client initialization

```ballerina
import ballerinax/aws.sqs;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

sqs:Client sqsClient = check new ({
    region: sqs:US_EAST_1,
    auth: { accessKeyId, secretAccessKey }
});
```

## Queue management

### Create a standard queue

```ballerina
string queueUrl = check sqsClient->createQueue("my-queue");
```

### Create a FIFO queue

```ballerina
string fifoQueueUrl = check sqsClient->createQueue("my-queue.fifo", {
    fifoQueue: true,
    contentBasedDeduplication: true
});
```

### List queues

```ballerina
sqs:ListQueuesResponse queues = check sqsClient->listQueues();
```

### Get queue attributes

```ballerina
sqs:GetQueueAttributesResponse attrs = check sqsClient->getQueueAttributes(queueUrl);
```

### Set queue attributes

```ballerina
sqs:QueueAttributes newAttrs = {
    visibilityTimeout: 300,
    messageRetentionPeriod: 1209600  // 14 days
};
check sqsClient->setQueueAttributes(queueUrl, newAttrs);
```

### Delete a queue

```ballerina
check sqsClient->deleteQueue(queueUrl);
```

## Message operations

### Send a message

```ballerina
sqs:SendMessageResponse response = check sqsClient->sendMessage(queueUrl,
    "Hello from Ballerina!");
```

### Send with delay

```ballerina
sqs:SendMessageResponse response = check sqsClient->sendMessage(queueUrl,
    "Delayed message", delaySeconds = 60);
```

### Send to a FIFO queue

```ballerina
sqs:SendMessageResponse response = check sqsClient->sendMessage(fifoQueueUrl,
    "FIFO message",
    messageGroupId = "group-1",
    messageDeduplicationId = "dedup-001");
```

### Send a batch

```ballerina
sqs:SendMessageBatchEntry[] entries = [
    { id: "msg1", body: "First message" },
    { id: "msg2", body: "Second message", delaySeconds: 5 }
];
sqs:SendMessageBatchResponse batchResp = check sqsClient->sendMessageBatch(
    queueUrl, entries);
```

### Receive messages

```ballerina
sqs:Message[] messages = check sqsClient->receiveMessage(queueUrl,
    maxNumberOfMessages = 10,
    waitTimeSeconds = 20);  // long polling

foreach var msg in messages {
    // Process msg.body
}
```

### Delete a message

```ballerina
check sqsClient->deleteMessage(queueUrl, msg.receiptHandle);
```

### Delete a batch

```ballerina
sqs:DeleteMessageBatchEntry[] deleteEntries = [
    { id: "del1", receiptHandle: messages[0].receiptHandle },
    { id: "del2", receiptHandle: messages[1].receiptHandle }
];
sqs:DeleteMessageBatchResponse delResp = check sqsClient->deleteMessageBatch(
    queueUrl, deleteEntries);
```

### Change visibility timeout

```ballerina
check sqsClient->changeMessageVisibility(queueUrl, msg.receiptHandle, 600);
```

## Error handling

```ballerina
do {
    sqs:SendMessageResponse resp = check sqsClient->sendMessage(queueUrl, "test");
} on fail error e {
    log:printError("SQS operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
