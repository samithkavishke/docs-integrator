---
title: "Java JMS - Actions"
description: "Available actions and operations for the ballerinax/java.jms connector."
---

# Java JMS Actions

The `ballerinax/java.jms` package provides Connection, Session, MessageProducer, MessageConsumer, and Listener.

## Connection and session

### Create a connection

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;

jms:Connection connection = check new (
    initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
    providerUrl = "tcp://localhost:61616"
);
```

### Create a session

```ballerina
jms:Session session = check connection->createSession();
```

## Producer operations

### Create a producer

```ballerina
jms:MessageProducer producer = check session.createProducer({
    'type: jms:QUEUE,
    name: "MyQueue"
});
```

### Send a text message

```ballerina
jms:TextMessage textMsg = { content: "Hello Ballerina!" };
check producer->send(textMsg);
```

### Send a map message

```ballerina
jms:MapMessage mapMsg = {
    content: {
        "orderId": "ORD-001",
        "amount": "99.99",
        "currency": "USD"
    }
};
check producer->send(mapMsg);
```

### Send a bytes message

```ballerina
jms:BytesMessage bytesMsg = {
    content: "Binary data".toBytes()
};
check producer->send(bytesMsg);
```

### Send to a topic

```ballerina
jms:MessageProducer topicProducer = check session.createProducer({
    'type: jms:TOPIC,
    name: "MyTopic"
});
check topicProducer->send({ content: "Topic message" });
```

## Consumer operations

### Create a consumer

```ballerina
jms:MessageConsumer consumer = check session.createConsumer(
    destination = {
        'type: jms:QUEUE,
        name: "MyQueue"
    }
);
```

### Receive a message (blocking with timeout)

```ballerina
jms:Message? response = check consumer->receive(3000); // 3 second timeout

if response is jms:TextMessage {
    log:printInfo("Received", content = response.content);
} else if response is jms:MapMessage {
    log:printInfo("Received map message");
} else if response is jms:BytesMessage {
    log:printInfo("Received bytes message");
}
```

### Receive without timeout (non-blocking)

```ballerina
jms:Message? response = check consumer->receiveNoWait();
```

## Listener (asynchronous consumer)

### Queue listener

```ballerina
import ballerinax/activemq.driver as _;
import ballerina/log;
import ballerinax/java.jms;

service "order-consumer" on new jms:Listener(
    connectionConfig = {
        initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl: "tcp://localhost:61616"
    },
    consumerOptions = {
        destination: {
            'type: jms:QUEUE,
            name: "OrderQueue"
        }
    }
) {
    remote function onMessage(jms:Message message) returns error? {
        if message is jms:TextMessage {
            log:printInfo("Order received", content = message.content);
        }
    }
}
```

### Topic listener

```ballerina
service "topic-subscriber" on new jms:Listener(
    connectionConfig = {
        initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl: "tcp://localhost:61616"
    },
    consumerOptions = {
        destination: {
            'type: jms:TOPIC,
            name: "EventTopic"
        }
    }
) {
    remote function onMessage(jms:Message message) returns error? {
        if message is jms:TextMessage {
            log:printInfo("Event", content = message.content);
        }
    }
}
```

## Error handling

```ballerina
do {
    check producer->send({ content: "test" });
} on fail jms:Error e {
    log:printError("JMS operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
