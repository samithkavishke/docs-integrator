---
title: "RabbitMQ - Actions"
description: "Available actions and operations for the ballerinax/rabbitmq connector."
---

# RabbitMQ Actions

The `ballerinax/rabbitmq` package provides a Client for publishing and managing exchanges/queues, and a Listener for consuming messages.

## Client operations

### Initialize the client

```ballerina
import ballerinax/rabbitmq;

rabbitmq:Client rabbitmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);
```

### Exchange management

```ballerina
// Declare a direct exchange
check rabbitmqClient->exchangeDeclare("my-exchange", rabbitmq:DIRECT_EXCHANGE);

// Delete an exchange
check rabbitmqClient->exchangeDelete("my-exchange");
```

### Queue management

```ballerina
// Declare a durable queue
check rabbitmqClient->queueDeclare("my-queue", {
    durable: true,
    exclusive: false,
    autoDelete: false
});

// Bind queue to exchange
check rabbitmqClient->queueBind("my-queue", "my-exchange", "routing-key");

// Purge all messages from a queue
check rabbitmqClient->queuePurge("my-queue");

// Delete a queue
check rabbitmqClient->queueDelete("my-queue");

// Delete only if empty
check rabbitmqClient->queueDelete("my-queue", false, true);

// Delete only if unused
check rabbitmqClient->queueDelete("my-queue", true, false);
```

### Publish messages

```ballerina
// Simple publish
string message = "Hello from Ballerina";
check rabbitmqClient->publishMessage({
    content: message.toBytes(),
    routingKey: "my-queue"
});

// Publish to an exchange with routing key
check rabbitmqClient->publishMessage({
    content: message.toBytes(),
    routingKey: "order.created",
    exchange: "order-exchange"
});

// Publish with properties
rabbitmq:BasicProperties props = {
    replyTo: "reply-queue",
    contentType: "application/json",
    correlationId: "req-001",
    deliveryMode: 2  // persistent
};

check rabbitmqClient->publishMessage({
    content: message.toBytes(),
    routingKey: "my-queue",
    properties: props
});
```

## Listener (consumer services)

### Basic message listener

```ballerina
import ballerinax/rabbitmq;
import ballerina/log;

listener rabbitmq:Listener rmqListener = new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

@rabbitmq:ServiceConfig {
    queueName: "my-queue"
}
service rabbitmq:Service on rmqListener {
    remote function onMessage(rabbitmq:AnydataMessage message) {
        log:printInfo("Received", content = message.content.toString());
    }
}
```

### Request-reply pattern

```ballerina
@rabbitmq:ServiceConfig {
    queueName: "rpc-queue"
}
service rabbitmq:Service on rmqListener {
    remote function onRequest(rabbitmq:AnydataMessage message) returns string {
        return "Processed: " + message.content.toString();
    }
}
```

### Client acknowledgments

#### Positive acknowledgment

```ballerina
@rabbitmq:ServiceConfig {
    queueName: "my-queue",
    autoAck: false
}
service rabbitmq:Service on rmqListener {
    remote function onMessage(rabbitmq:AnydataMessage message,
            rabbitmq:Caller caller) returns error? {
        do {
            check processMessage(message);
            check caller->basicAck();
        } on fail error e {
            log:printError("Processing failed", 'error = e);
            check caller->basicNack(requeue = true);
        }
    }
}
```

#### Negative acknowledgment

```ballerina
// Reject and do NOT requeue (discard or route to DLX)
check caller->basicNack(requeue = false);

// Reject a single message
check caller->basicReject(requeue = false);
```

## Error handling

```ballerina
do {
    check rabbitmqClient->publishMessage({
        content: "test".toBytes(),
        routingKey: "my-queue"
    });
} on fail rabbitmq:Error e {
    log:printError("RabbitMQ operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
