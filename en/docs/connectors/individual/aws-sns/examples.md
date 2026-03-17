---
title: "Amazon SNS - Examples"
description: "Code examples for the ballerinax/aws.sns connector."
---

# Amazon SNS Examples

## Example 1: Notification system

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/aws.sns;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string topicArn = ?;

final sns:Client snsClient = check new ({
    credentials: { accessKeyId, secretAccessKey },
    region
});

service /api on new http:Listener(8080) {
    resource function post notify(record {|string subject; string message;|} notification)
            returns http:Ok|http:InternalServerError {
        do {
            string messageId = check snsClient->publish(topicArn,
                notification.message);
            log:printInfo("Notification sent", messageId = messageId);
            return http:OK;
        } on fail error e {
            log:printError("Failed to send notification", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

## Example 2: Multi-channel alert system

```ballerina
import ballerina/log;
import ballerinax/aws.sns;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    sns:Client snsClient = check new ({
        credentials: { accessKeyId, secretAccessKey },
        region
    });

    // Create an alert topic
    string topicArn = check snsClient->createTopic("system-alerts");

    // Subscribe multiple channels
    _ = check snsClient->subscribe(topicArn, "email", "ops-team@example.com");
    _ = check snsClient->subscribe(topicArn, "sms", "+1234567890");
    _ = check snsClient->subscribe(topicArn, "https", "https://slack-webhook.example.com/alert");

    // Publish an alert -- all subscribers receive it
    string messageId = check snsClient->publish(topicArn,
        "ALERT: CPU usage exceeded 90% on prod-server-01",
        messageAttributes = {
            "severity": { dataType: "String", stringValue: "critical" },
            "service": { dataType: "String", stringValue: "monitoring" }
        }
    );

    log:printInfo("Alert published to all channels", messageId = messageId);
}
```

## Example 3: SNS to SQS fan-out

```ballerina
import ballerina/log;
import ballerinax/aws.sns;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string orderTopicArn = ?;
configurable string fulfillmentQueueArn = ?;
configurable string analyticsQueueArn = ?;

public function main() returns error? {
    sns:Client snsClient = check new ({
        credentials: { accessKeyId, secretAccessKey },
        region
    });

    // Fan-out: subscribe multiple SQS queues to the same topic
    _ = check snsClient->subscribe(orderTopicArn, "sqs", fulfillmentQueueArn);
    _ = check snsClient->subscribe(orderTopicArn, "sqs", analyticsQueueArn);

    // Every published message goes to both queues
    string msgId = check snsClient->publish(orderTopicArn,
        {"orderId": "ORD-123", "status": "created"}.toJsonString());

    log:printInfo("Order event fanned out", messageId = msgId);
}
```

## Example 4: Config.toml

```toml
# Config.toml
accessKeyId = "AKIAIOSFODNN7EXAMPLE"
secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
region = "us-east-1"
topicArn = "arn:aws:sns:us-east-1:123456789:system-alerts"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
