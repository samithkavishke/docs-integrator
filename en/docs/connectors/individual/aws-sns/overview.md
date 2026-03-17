---
title: "Amazon SNS"
description: "Overview of the ballerinax/aws.sns connector for WSO2 Integrator."
---

# Amazon SNS

| | |
|---|---|
| **Package** | [`ballerinax/aws.sns`](https://central.ballerina.io/ballerinax/aws.sns/latest) |
| **Version** | 3.0.0 |
| **Category** | Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.sns/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.sns/latest#functions) |
| **Source** | [GitHub](https://github.com/ballerina-platform/module-ballerinax-aws.sns) |

## Overview

The `ballerinax/aws.sns` package provides APIs to interact with Amazon Simple Notification Service (SNS), a fully managed pub/sub messaging service for application-to-application and application-to-person communication.

### Key capabilities

- **Topic management**: Create, list, and delete SNS topics
- **Subscriptions**: Subscribe endpoints (email, SMS, HTTP/S, SQS, Lambda) to topics
- **Publishing**: Publish messages to topics with optional message attributes
- **Message filtering**: Use subscription filter policies for selective message delivery
- **Platform applications**: Send push notifications to mobile devices

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.sns"
version = "3.0.0"
```

```ballerina
import ballerinax/aws.sns;
import ballerina/log;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    sns:Client snsClient = check new ({
        credentials: { accessKeyId, secretAccessKey },
        region
    });

    // Create a topic
    string topicArn = check snsClient->createTopic("order-events");

    // Publish a message
    string messageId = check snsClient->publish(topicArn, "New order placed");
    log:printInfo("Message published", messageId = messageId);
}
```

## Related resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/aws.sns/latest)
