---
title: "Google Cloud Pub/Sub - Examples"
description: "Code examples for the ballerinax/gcloud.pubsub connector."
---

# Google Cloud Pub/Sub Examples

## Example 1: Event-driven order processing

### Publisher

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string credentialsPath = ?;

final pubsub:Publisher orderPublisher = check new ("order-events",
    projectId = projectId,
    credentials = { credentialsPath }
);

type Order record {|
    string orderId;
    string customerId;
    decimal total;
|};

service /api on new http:Listener(8080) {
    resource function post orders(Order order) returns http:Accepted|http:InternalServerError {
        do {
            string msgId = check orderPublisher->publish({
                data: order.toJsonString().toBytes(),
                attributes: {
                    "eventType": "order.created",
                    "customerId": order.customerId
                }
            });
            log:printInfo("Order published", messageId = msgId);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Publish failed", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Subscriber

```ballerina
import ballerina/log;
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string credentialsPath = ?;

listener pubsub:Listener orderListener = check new ("order-processing-sub",
    projectId = projectId,
    credentials = { credentialsPath }
);

type Order record {|
    string orderId;
    string customerId;
    decimal total;
|};

service on orderListener {
    remote function onMessage(pubsub:PubSubMessage message,
            pubsub:Caller caller) returns error? {
        do {
            string data = check string:fromBytes(message.data);
            Order order = check data.fromJsonStringWithType();
            log:printInfo("Processing order",
                orderId = order.orderId, total = order.total);
            check caller->ack();
        } on fail error e {
            log:printError("Order processing failed", 'error = e);
            check caller->nack();
        }
    }
}
```

## Example 2: Batch publishing

```ballerina
import ballerina/log;
import ballerinax/gcloud.pubsub;

configurable string projectId = ?;
configurable string credentialsPath = ?;

public function main() returns error? {
    pubsub:Publisher publisher = check new ("analytics-events",
        projectId = projectId,
        credentials = { credentialsPath }
    );

    pubsub:PubSubMessage[] messages = [
        { data: "Page view: /home".toBytes(), attributes: { "page": "/home" } },
        { data: "Page view: /products".toBytes(), attributes: { "page": "/products" } },
        { data: "Click: buy-button".toBytes(), attributes: { "element": "buy-button" } }
    ];

    string[] messageIds = check publisher->publishBatch(messages);
    log:printInfo("Batch published", count = messageIds.length());
    check publisher->close();
}
```

## Example 3: Config.toml

```toml
# Config.toml
projectId = "my-gcp-project"
credentialsPath = "/secrets/service-account.json"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
