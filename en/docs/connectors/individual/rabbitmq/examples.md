---
title: "RabbitMQ - Examples"
description: "Code examples for the ballerinax/rabbitmq connector."
---

# RabbitMQ Examples

## Example 1: Task queue with worker acknowledgment

### Producer

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/rabbitmq;

final rabbitmq:Client rmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

public function main() returns error? {
    check rmqClient->queueDeclare("task-queue", {
        durable: true,
        exclusive: false,
        autoDelete: false
    });
}

service /api on new http:Listener(8080) {
    resource function post tasks(record {|string taskId; string payload;|} task)
            returns http:Accepted|http:InternalServerError {
        do {
            check rmqClient->publishMessage({
                content: task.toJsonString().toBytes(),
                routingKey: "task-queue",
                properties: { deliveryMode: 2, correlationId: task.taskId }
            });
            log:printInfo("Task queued", taskId = task.taskId);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Failed to queue task", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Worker

```ballerina
import ballerina/log;
import ballerinax/rabbitmq;

listener rabbitmq:Listener workerListener = new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

@rabbitmq:ServiceConfig {
    queueName: "task-queue",
    autoAck: false
}
service rabbitmq:Service on workerListener {
    remote function onMessage(rabbitmq:AnydataMessage message,
            rabbitmq:Caller caller) returns error? {
        do {
            string content = check string:fromBytes(<byte[]>message.content);
            log:printInfo("Processing task", content = content);
            check processTask(content);
            check caller->basicAck();
        } on fail error e {
            log:printError("Task failed, requeueing", 'error = e);
            check caller->basicNack(requeue = true);
        }
    }
}

function processTask(string content) returns error? {
    log:printInfo("Working on: " + content);
}
```

## Example 2: Pub/Sub with fanout exchange

### Publisher

```ballerina
import ballerina/log;
import ballerinax/rabbitmq;

public function main() returns error? {
    rabbitmq:Client rmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

    check rmqClient->exchangeDeclare("notifications", rabbitmq:FANOUT_EXCHANGE);

    string notification = {"type": "alert", "message": "System maintenance"}.toJsonString();
    check rmqClient->publishMessage({
        content: notification.toBytes(),
        routingKey: "",
        exchange: "notifications"
    });
    log:printInfo("Notification broadcast sent");
}
```

### Subscriber

```ballerina
import ballerina/log;
import ballerinax/rabbitmq;

listener rabbitmq:Listener subListener = new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

@rabbitmq:ServiceConfig {
    queueName: "email-notifications"
}
service rabbitmq:Service on subListener {
    remote function onMessage(rabbitmq:AnydataMessage message) {
        string|error content = string:fromBytes(<byte[]>message.content);
        if content is string {
            log:printInfo("Email subscriber received", notification = content);
        }
    }
}
```

## Example 3: Request-reply (RPC)

```ballerina
import ballerina/log;
import ballerinax/rabbitmq;

listener rabbitmq:Listener rpcListener = new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

@rabbitmq:ServiceConfig {
    queueName: "rpc-queue"
}
service rabbitmq:Service on rpcListener {
    remote function onRequest(rabbitmq:AnydataMessage message) returns string {
        string|error content = string:fromBytes(<byte[]>message.content);
        if content is string {
            log:printInfo("RPC request", request = content);
            return "Result for: " + content;
        }
        return "Error processing request";
    }
}
```

## Example 4: Dead-letter exchange

```ballerina
import ballerina/log;
import ballerinax/rabbitmq;

public function main() returns error? {
    rabbitmq:Client rmqClient = check new (rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);

    check rmqClient->exchangeDeclare("dlx-exchange", rabbitmq:DIRECT_EXCHANGE);
    check rmqClient->queueDeclare("dead-letters", { durable: true });
    check rmqClient->queueBind("dead-letters", "dlx-exchange", "failed");

    check rmqClient->queueDeclare("main-queue", {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": "dlx-exchange",
            "x-dead-letter-routing-key": "failed",
            "x-message-ttl": 30000
        }
    });
    log:printInfo("Queues with DLX configured");
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
