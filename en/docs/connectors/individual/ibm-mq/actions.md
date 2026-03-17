---
title: "IBM MQ - Actions"
description: "Available actions and operations for the ballerinax/ibm.ibmmq connector."
---

# IBM MQ Actions

The `ballerinax/ibm.ibmmq` package provides QueueManager, Queue, and Topic types for messaging operations.

## Queue manager

### Connect to a queue manager

```ballerina
import ballerinax/ibm.ibmmq;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

ibmmq:QueueManager queueManager = check new (
    name = queueManagerName, host = host, port = port,
    channel = channel, userID = userID, password = password
);
```

### Disconnect

```ballerina
check queueManager.disconnect();
```

## Queue operations

### Access a queue

```ballerina
// Output only (put messages)
ibmmq:Queue outputQueue = check queueManager.accessQueue("MY.QUEUE",
    ibmmq:MQOO_OUTPUT);

// Input only (get messages)
ibmmq:Queue inputQueue = check queueManager.accessQueue("MY.QUEUE",
    ibmmq:MQOO_INPUT_AS_Q_DEF);

// Both input and output
ibmmq:Queue queue = check queueManager.accessQueue("MY.QUEUE",
    ibmmq:MQOO_OUTPUT | ibmmq:MQOO_INPUT_AS_Q_DEF);
```

### Put a message

```ballerina
check queue->put({
    payload: "Hello IBM MQ".toBytes()
});
```

### Put with message descriptor

```ballerina
check queue->put({
    payload: "Important message".toBytes(),
    correlationId: "corr-001".toBytes(),
    messageType: ibmmq:MQMT_REQUEST,
    replyToQueue: "REPLY.QUEUE"
});
```

### Get a message

```ballerina
ibmmq:Message? message = check queue->get();

if message is ibmmq:Message {
    string content = check string:fromBytes(message.payload);
    log:printInfo("Received", content = content);
}
```

### Get with timeout

```ballerina
ibmmq:Message? message = check queue->get(waitInterval = 5000);
```

### Close a queue

```ballerina
check queue->close();
```

## Topic operations

### Access a topic

```ballerina
ibmmq:Topic topic = check queueManager.accessTopic(
    "MY.TOPIC", "my/topic/string",
    ibmmq:MQOO_OUTPUT | ibmmq:MQOO_INPUT_AS_Q_DEF
);
```

### Publish to a topic

```ballerina
check topic->put({
    payload: "Topic message".toBytes()
});
```

### Subscribe (get from topic)

```ballerina
ibmmq:Message? topicMsg = check topic->get();
```

### Close a topic

```ballerina
check topic->close();
```

## Error handling

```ballerina
do {
    check queue->put({ payload: "test".toBytes() });
} on fail ibmmq:Error e {
    log:printError("IBM MQ operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
