---
title: "Solace PubSub+ - Examples"
description: "Code examples for the ballerinax/solace connector."
---

# Solace PubSub+ Examples

## Example 1: Order processing

### Producer

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/solace;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string username = ?;
configurable string password = ?;

final solace:MessageProducer orderProducer = check new (brokerUrl,
    destination = { queueName: "order-queue" },
    messageVpn = messageVpn,
    auth = { username, password }
);

type Order record {|
    string orderId;
    string item;
    int quantity;
|};

service /api on new http:Listener(8080) {
    resource function post orders(Order order) returns http:Accepted|http:InternalServerError {
        do {
            check orderProducer->send({
                payload: order.toJsonString()
            });
            log:printInfo("Order sent", orderId = order.orderId);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Send failed", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Consumer

```ballerina
import ballerina/log;
import ballerinax/solace;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    solace:MessageConsumer consumer = check new (brokerUrl,
        destination = { queueName: "order-queue" },
        messageVpn = messageVpn,
        auth = { username, password }
    );

    log:printInfo("Listening for orders...");
    while true {
        solace:Message? message = check consumer->receive(30.0);
        if message is solace:Message {
            log:printInfo("Processing order", payload = message.payload);
        }
    }
}
```

## Example 2: Multiple queue processing

```ballerina
import ballerina/log;
import ballerinax/solace;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    solace:MessageProducer highPriority = check new (brokerUrl,
        destination = { queueName: "orders-high" },
        messageVpn = messageVpn,
        auth = { username, password }
    );

    solace:MessageProducer lowPriority = check new (brokerUrl,
        destination = { queueName: "orders-low" },
        messageVpn = messageVpn,
        auth = { username, password }
    );

    // Route messages based on priority
    check highPriority->send({ payload: "Urgent order" });
    check lowPriority->send({ payload: "Regular order" });

    log:printInfo("Messages routed to priority queues");
    check highPriority->close();
    check lowPriority->close();
}
```

## Example 3: Config.toml

```toml
# Config.toml
brokerUrl = "tcp://solace-broker:55555"
messageVpn = "default"
username = "app-user"
password = "secure-password"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
