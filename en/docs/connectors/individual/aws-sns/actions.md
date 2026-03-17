---
title: "Amazon SNS - Actions"
description: "Available actions and operations for the ballerinax/aws.sns connector."
---

# Amazon SNS Actions

The `ballerinax/aws.sns` package provides a Client for topic management, subscriptions, and publishing.

## Client initialization

```ballerina
import ballerinax/aws.sns;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

sns:Client snsClient = check new ({
    credentials: { accessKeyId, secretAccessKey },
    region
});
```

## Topic management

### Create a topic

```ballerina
string topicArn = check snsClient->createTopic("my-topic");
```

### Create a FIFO topic

```ballerina
string fifoTopicArn = check snsClient->createTopic("my-topic.fifo", {
    fifoTopic: true,
    contentBasedDeduplication: true
});
```

### Get topic attributes

```ballerina
sns:TopicAttributes attrs = check snsClient->getTopicAttributes(topicArn);
```

### List topics

```ballerina
sns:Topic[] topics = check snsClient->listTopics();
```

### Delete a topic

```ballerina
check snsClient->deleteTopic(topicArn);
```

## Subscription management

### Subscribe an endpoint

```ballerina
// Email subscription
string subscriptionArn = check snsClient->subscribe(topicArn,
    "email", "user@example.com");

// SQS subscription
string sqsSubArn = check snsClient->subscribe(topicArn,
    "sqs", sqsQueueArn);

// HTTP/HTTPS endpoint
string httpSubArn = check snsClient->subscribe(topicArn,
    "https", "https://api.example.com/webhook");

// SMS subscription
string smsSubArn = check snsClient->subscribe(topicArn,
    "sms", "+1234567890");
```

### List subscriptions

```ballerina
sns:Subscription[] subs = check snsClient->listSubscriptions();
```

### Unsubscribe

```ballerina
check snsClient->unsubscribe(subscriptionArn);
```

## Publishing

### Publish a simple message

```ballerina
string messageId = check snsClient->publish(topicArn, "Hello SNS!");
```

### Publish with attributes

```ballerina
string messageId = check snsClient->publish(topicArn,
    "Order event",
    messageAttributes = {
        "eventType": { dataType: "String", stringValue: "OrderCreated" },
        "priority": { dataType: "String", stringValue: "high" }
    }
);
```

### Publish to a specific target (direct publish)

```ballerina
// Publish to a phone number directly
string msgId = check snsClient->publish("+1234567890",
    "Your verification code is 123456",
    targetType = "PhoneNumber");
```

## Error handling

```ballerina
do {
    string msgId = check snsClient->publish(topicArn, "test");
} on fail error e {
    log:printError("SNS operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
