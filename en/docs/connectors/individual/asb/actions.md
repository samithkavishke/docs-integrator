---
title: "Azure Service Bus - Actions"
description: "Available actions and operations for the ballerinax/asb connector."
---

# Azure Service Bus Actions

The `ballerinax/asb` package provides Admin, MessageSender, and MessageReceiver clients.

## Admin client operations

### Initialize the admin client

```ballerina
import ballerinax/asb;

configurable string connectionString = ?;
asb:AdminClient admin = check new (connectionString);
```

### Queue management

```ballerina
// Create a queue
check admin->createQueue("my-queue");

// Get queue properties
asb:QueueProperties? props = check admin->getQueue("my-queue");

// List all queues
asb:QueueList queues = check admin->listQueues();

// Update queue properties
check admin->updateQueue("my-queue", { maxDeliveryCount: 10 });

// Delete a queue
check admin->deleteQueue("my-queue");
```

### Topic and subscription management

```ballerina
// Create a topic
check admin->createTopic("my-topic");

// Create a subscription on a topic
check admin->createSubscription("my-topic", "my-subscription");

// List subscriptions
asb:SubscriptionList subs = check admin->listSubscriptions("my-topic");

// Delete subscription and topic
check admin->deleteSubscription("my-topic", "my-subscription");
check admin->deleteTopic("my-topic");
```

### Rule management

```ballerina
// Create a rule for filtering messages
check admin->createRule("my-topic", "my-subscription", "priority-filter", {
    filter: { sqlExpression: "priority = 'high'" }
});
```

## Message sender operations

### Initialize the sender

```ballerina
asb:MessageSender sender = check new (connectionString, "my-queue");
```

### Send a single message

```ballerina
check sender->send({
    body: "Hello from Ballerina",
    contentType: "text/plain"
});
```

### Send with properties

```ballerina
check sender->send({
    body: {"orderId": "123", "amount": 99.99}.toJsonString(),
    contentType: "application/json",
    messageId: "msg-001",
    sessionId: "session-A",
    applicationProperties: {
        "priority": "high",
        "source": "web"
    }
});
```

### Send a batch of messages

```ballerina
check sender->sendBatch([
    { body: "Message 1", contentType: "text/plain" },
    { body: "Message 2", contentType: "text/plain" },
    { body: "Message 3", contentType: "text/plain" }
]);
```

### Schedule a message

```ballerina
int sequenceNumber = check sender->schedule({
    body: "Scheduled message",
    contentType: "text/plain"
}, scheduledEnqueueTime);

// Cancel a scheduled message
check sender->cancel(sequenceNumber);
```

### Close the sender

```ballerina
check sender->close();
```

## Message receiver operations

### Initialize the receiver

```ballerina
// Peek-lock mode (must complete or abandon)
asb:MessageReceiver receiver = check new (connectionString, "my-queue", asb:PEEK_LOCK);
```

### Receive a message

```ballerina
asb:Message? message = check receiver->receive(30); // 30 second timeout
if message is asb:Message {
    // Process the message
    string body = message.body.toString();
}
```

### Receive a batch

```ballerina
asb:MessageBatch batch = check receiver->receiveBatch(10, 30);
foreach asb:Message msg in batch.messages {
    // Process each message
}
```

### Complete a message (acknowledge)

```ballerina
check receiver->complete(message);
```

### Abandon a message (release the lock)

```ballerina
check receiver->abandon(message);
```

### Dead-letter a message

```ballerina
check receiver->deadLetter(message, reason = "ProcessingFailed",
    description = "Unable to parse message body");
```

### Defer a message

```ballerina
check receiver->defer(message);
```

### Peek without locking

```ballerina
asb:Message? peeked = check receiver->peek();
```

### Receive from dead-letter queue

```ballerina
asb:MessageReceiver dlqReceiver = check new (connectionString,
    "my-queue/$DeadLetterQueue", asb:PEEK_LOCK);

asb:Message? deadLetter = check dlqReceiver->receive(10);
```

### Close the receiver

```ballerina
check receiver->close();
```

## Error handling

```ballerina
do {
    check sender->send({ body: "test", contentType: "text/plain" });
} on fail asb:Error e {
    log:printError("ASB operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
