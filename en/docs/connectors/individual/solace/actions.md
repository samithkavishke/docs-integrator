---
title: "Solace PubSub+ - Actions"
description: "Available actions and operations for the ballerinax/solace connector."
---

# Solace PubSub+ Actions

The `ballerinax/solace` package provides MessageProducer and MessageConsumer clients.

## MessageProducer

### Initialize a producer

```ballerina
import ballerinax/solace;

configurable string brokerUrl = ?;
configurable string messageVpn = ?;
configurable string queueName = ?;
configurable string username = ?;
configurable string password = ?;

solace:MessageProducer producer = check new (brokerUrl,
    destination = { queueName },
    messageVpn = messageVpn,
    auth = { username, password }
);
```

### Send a message

```ballerina
check producer->send({
    payload: "Hello Solace!"
});
```

### Send with properties

```ballerina
check producer->send({
    payload: {"orderId": "ORD-001", "status": "created"}.toJsonString(),
    properties: {
        "contentType": "application/json",
        "correlationId": "corr-001"
    }
});
```

### Close the producer

```ballerina
check producer->close();
```

## MessageConsumer

### Initialize a consumer

```ballerina
solace:MessageConsumer consumer = check new (brokerUrl,
    destination = { queueName },
    messageVpn = messageVpn,
    auth = { username, password }
);
```

### Receive a message

```ballerina
// Receive with timeout (seconds)
solace:Message? message = check consumer->receive(5.0);

if message is solace:Message {
    log:printInfo("Received", payload = message.payload);
}
```

### Receive in a loop

```ballerina
while true {
    solace:Message? message = check consumer->receive(10.0);
    if message is solace:Message {
        log:printInfo("Processing", payload = message.payload);
    }
}
```

### Close the consumer

```ballerina
check consumer->close();
```

## Error handling

```ballerina
do {
    check producer->send({ payload: "test" });
} on fail solace:Error e {
    log:printError("Solace operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
