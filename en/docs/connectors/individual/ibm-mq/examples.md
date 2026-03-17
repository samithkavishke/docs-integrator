---
title: "IBM MQ - Examples"
description: "Code examples for the ballerinax/ibm.ibmmq connector."
---

# IBM MQ Examples

## Example 1: Queue producer and consumer

### Producer

```ballerina
import ballerinax/ibm.ibmmq;
import ballerina/log;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

public function main() returns error? {
    ibmmq:QueueManager qm = check new (
        name = queueManagerName, host = host, port = port,
        channel = channel, userID = userID, password = password
    );

    ibmmq:Queue queue = check qm.accessQueue("DEV.QUEUE.1", ibmmq:MQOO_OUTPUT);

    check queue->put({
        payload: {"orderId": "ORD-001", "amount": 150.00}.toJsonString().toBytes()
    });

    log:printInfo("Message sent to IBM MQ queue");
    check queue->close();
    check qm.disconnect();
}
```

### Consumer

```ballerina
import ballerinax/ibm.ibmmq;
import ballerina/log;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

public function main() returns error? {
    ibmmq:QueueManager qm = check new (
        name = queueManagerName, host = host, port = port,
        channel = channel, userID = userID, password = password
    );

    ibmmq:Queue queue = check qm.accessQueue("DEV.QUEUE.1",
        ibmmq:MQOO_INPUT_AS_Q_DEF);

    ibmmq:Message? message = check queue->get(waitInterval = 10000);
    while message is ibmmq:Message {
        string content = check string:fromBytes(message.payload);
        log:printInfo("Received", content = content);
        message = check queue->get(waitInterval = 5000);
    }

    log:printInfo("No more messages");
    check queue->close();
    check qm.disconnect();
}
```

## Example 2: Topic pub/sub

### Publisher

```ballerina
import ballerinax/ibm.ibmmq;
import ballerina/log;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

public function main() returns error? {
    ibmmq:QueueManager qm = check new (
        name = queueManagerName, host = host, port = port,
        channel = channel, userID = userID, password = password
    );

    ibmmq:Topic topic = check qm.accessTopic(
        "EVENTS.TOPIC", "events/orders",
        ibmmq:MQOO_OUTPUT
    );

    check topic->put({
        payload: "New order event".toBytes()
    });

    log:printInfo("Published to topic");
    check topic->close();
    check qm.disconnect();
}
```

## Example 3: Request-reply pattern

```ballerina
import ballerinax/ibm.ibmmq;
import ballerina/log;

configurable string queueManagerName = ?;
configurable string host = ?;
configurable int port = ?;
configurable string channel = ?;
configurable string userID = ?;
configurable string password = ?;

public function main() returns error? {
    ibmmq:QueueManager qm = check new (
        name = queueManagerName, host = host, port = port,
        channel = channel, userID = userID, password = password
    );

    ibmmq:Queue requestQueue = check qm.accessQueue("REQUEST.QUEUE", ibmmq:MQOO_OUTPUT);
    ibmmq:Queue replyQueue = check qm.accessQueue("REPLY.QUEUE",
        ibmmq:MQOO_INPUT_AS_Q_DEF);

    // Send request with replyTo
    check requestQueue->put({
        payload: "What is the status?".toBytes(),
        replyToQueue: "REPLY.QUEUE",
        messageType: ibmmq:MQMT_REQUEST
    });

    // Wait for reply
    ibmmq:Message? reply = check replyQueue->get(waitInterval = 10000);
    if reply is ibmmq:Message {
        log:printInfo("Reply received",
            content = check string:fromBytes(reply.payload));
    }

    check requestQueue->close();
    check replyQueue->close();
    check qm.disconnect();
}
```

## Example 4: Config.toml

```toml
# Config.toml
queueManagerName = "QM1"
host = "ibmmq.example.com"
port = 1414
channel = "DEV.APP.SVRCONN"
userID = "app-user"
password = "secure-password"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
