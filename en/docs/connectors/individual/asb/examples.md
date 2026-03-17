---
title: "Azure Service Bus - Examples"
description: "Code examples for the ballerinax/asb connector."
---

# Azure Service Bus Examples

## Example 1: Queue-based order processing

### Sender

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

final asb:MessageSender orderSender = check new (connectionString, "order-queue");

type Order record {|
    string orderId;
    string customerId;
    decimal amount;
|};

service /api on new http:Listener(8080) {
    resource function post orders(Order order) returns http:Accepted|http:InternalServerError {
        do {
            check orderSender->send({
                body: order.toJsonString(),
                contentType: "application/json",
                messageId: order.orderId,
                applicationProperties: {
                    "customerId": order.customerId,
                    "priority": order.amount > 1000d ? "high" : "normal"
                }
            });
            log:printInfo("Order sent to queue", orderId = order.orderId);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Failed to send order", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Receiver

```ballerina
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

type Order record {|
    string orderId;
    string customerId;
    decimal amount;
|};

public function main() returns error? {
    asb:MessageReceiver receiver = check new (connectionString,
        "order-queue", asb:PEEK_LOCK);

    while true {
        asb:Message? message = check receiver->receive(60);
        if message is asb:Message {
            do {
                string body = message.body.toString();
                Order order = check body.fromJsonStringWithType();
                check processOrder(order);
                check receiver->complete(message);
                log:printInfo("Order processed", orderId = order.orderId);
            } on fail error e {
                log:printError("Processing failed, dead-lettering", 'error = e);
                check receiver->deadLetter(message,
                    reason = "ProcessingFailed",
                    description = e.message());
            }
        }
    }
}

function processOrder(Order order) returns error? {
    log:printInfo("Processing order", orderId = order.orderId, amount = order.amount);
}
```

## Example 2: Pub/Sub with topic and subscriptions

### Publisher

```ballerina
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

public function main() returns error? {
    asb:MessageSender topicSender = check new (connectionString, "notifications-topic");

    check topicSender->send({
        body: {"type": "system", "message": "Maintenance window starting"}.toJsonString(),
        contentType: "application/json",
        applicationProperties: {
            "notificationType": "system"
        }
    });

    log:printInfo("Notification published to topic");
    check topicSender->close();
}
```

### Subscriber

```ballerina
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

public function main() returns error? {
    asb:MessageReceiver subReceiver = check new (connectionString,
        "notifications-topic", asb:PEEK_LOCK,
        subscriptionName = "email-subscription");

    while true {
        asb:Message? message = check subReceiver->receive(60);
        if message is asb:Message {
            log:printInfo("Subscription received", body = message.body.toString());
            check subReceiver->complete(message);
        }
    }
}
```

## Example 3: Session-aware messaging

```ballerina
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

public function main() returns error? {
    asb:MessageSender sender = check new (connectionString, "session-queue");

    // Send messages to specific sessions for ordered processing
    check sender->send({
        body: "Step 1 for customer A",
        contentType: "text/plain",
        sessionId: "customer-A"
    });

    check sender->send({
        body: "Step 2 for customer A",
        contentType: "text/plain",
        sessionId: "customer-A"
    });

    check sender->send({
        body: "Step 1 for customer B",
        contentType: "text/plain",
        sessionId: "customer-B"
    });

    log:printInfo("Session messages sent");
    check sender->close();
}
```

## Example 4: Dead-letter queue inspection

```ballerina
import ballerina/log;
import ballerinax/asb;

configurable string connectionString = ?;

public function main() returns error? {
    // Access the dead-letter sub-queue
    asb:MessageReceiver dlqReceiver = check new (connectionString,
        "order-queue/$DeadLetterQueue", asb:PEEK_LOCK);

    asb:Message? dlMessage = check dlqReceiver->receive(10);
    while dlMessage is asb:Message {
        log:printError("Dead-lettered message",
            body = dlMessage.body.toString(),
            reason = dlMessage.deadLetterReason.toString());
        check dlqReceiver->complete(dlMessage);
        dlMessage = check dlqReceiver->receive(10);
    }

    log:printInfo("DLQ inspection complete");
    check dlqReceiver->close();
}
```

## Example 5: Config.toml

```toml
# Config.toml
connectionString = "Endpoint=sb://my-ns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=abc123..."
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
