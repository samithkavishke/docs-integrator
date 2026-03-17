---
title: "Amazon SNS - Setup"
description: "How to set up and configure the ballerinax/aws.sns connector."
---

# Amazon SNS Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An AWS account with IAM permissions for SNS
- AWS Access Key ID and Secret Access Key

## Installation

### Using code

```ballerina
import ballerinax/aws.sns;
```

```toml
[[dependency]]
org = "ballerinax"
name = "aws.sns"
version = "3.0.0"
```

## AWS setup

### Create an IAM user with SNS permissions

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to **IAM** > **Users** > **Create User**
3. Attach the `AmazonSNSFullAccess` policy
4. Create an access key and record both the Access Key ID and Secret Access Key

## Configuration

### Client initialization

```ballerina
configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

sns:Client snsClient = check new ({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});
```

### Config.toml

```toml
# Config.toml
accessKeyId = "AKIAIOSFODNN7EXAMPLE"
secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
region = "us-east-1"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `InvalidClientTokenId` | Bad access key | Verify `accessKeyId` |
| `SignatureDoesNotMatch` | Bad secret key | Verify `secretAccessKey` |
| `AuthorizationError` | Missing IAM permissions | Attach SNS policy |
| `NotFound` | Topic ARN invalid | Check topic ARN format |

## Next steps

- [Actions Reference](actions) -- Topic and publish operations
- [Examples](examples) -- Code examples
