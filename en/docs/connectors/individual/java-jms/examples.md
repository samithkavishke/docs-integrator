---
title: "Java JMS - Examples"
description: "Code examples for the ballerinax/java.jms connector."
---

# Java JMS Examples

## Example 1: Queue producer and consumer

### Producer

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;
import ballerina/log;

public function main() returns error? {
    jms:Connection connection = check new (
        initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl = "tcp://localhost:61616"
    );
    jms:Session session = check connection->createSession();
    jms:MessageProducer producer = check session.createProducer({
        'type: jms:QUEUE,
        name: "OrderQueue"
    });

    jms:TextMessage msg = {
        content: {"orderId": "ORD-001", "item": "Widget", "qty": 5}.toJsonString()
    };
    check producer->send(msg);
    log:printInfo("Order sent to queue");
}
```

### Consumer

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;
import ballerina/log;

public function main() returns error? {
    jms:Connection connection = check new (
        initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl = "tcp://localhost:61616"
    );
    jms:Session session = check connection->createSession();
    jms:MessageConsumer consumer = check session.createConsumer(
        destination = { 'type: jms:QUEUE, name: "OrderQueue" }
    );

    while true {
        jms:Message? response = check consumer->receive(5000);
        if response is jms:TextMessage {
            log:printInfo("Received order", content = response.content);
        }
    }
}
```

## Example 2: Asynchronous listener service

```ballerina
import ballerinax/activemq.driver as _;
import ballerina/log;
import ballerinax/java.jms;

service "event-processor" on new jms:Listener(
    connectionConfig = {
        initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl: "tcp://localhost:61616"
    },
    consumerOptions = {
        destination: { 'type: jms:QUEUE, name: "EventQueue" }
    }
) {
    remote function onMessage(jms:Message message) returns error? {
        if message is jms:TextMessage {
            log:printInfo("Event processed", content = message.content);
        } else if message is jms:MapMessage {
            log:printInfo("Map message received");
        }
    }
}
```

## Example 3: Topic pub/sub

### Publisher

```ballerina
import ballerinax/activemq.driver as _;
import ballerinax/java.jms;
import ballerina/log;

public function main() returns error? {
    jms:Connection connection = check new (
        initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl = "tcp://localhost:61616"
    );
    jms:Session session = check connection->createSession();
    jms:MessageProducer topicProducer = check session.createProducer({
        'type: jms:TOPIC,
        name: "NotificationTopic"
    });

    check topicProducer->send({ content: "System alert: Maintenance at 2 AM" });
    log:printInfo("Notification published to topic");
}
```

### Subscriber

```ballerina
import ballerinax/activemq.driver as _;
import ballerina/log;
import ballerinax/java.jms;

service "notification-handler" on new jms:Listener(
    connectionConfig = {
        initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
        providerUrl: "tcp://localhost:61616"
    },
    consumerOptions = {
        destination: { 'type: jms:TOPIC, name: "NotificationTopic" }
    }
) {
    remote function onMessage(jms:Message message) returns error? {
        if message is jms:TextMessage {
            log:printInfo("Notification received", content = message.content);
        }
    }
}
```

## Example 4: Config.toml

```toml
# Config.toml
providerUrl = "tcp://activemq.example.com:61616"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
