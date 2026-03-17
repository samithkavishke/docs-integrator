---
title: "Amazon SQS - Setup"
description: "How to set up and configure the ballerinax/aws.sqs connector."
---

# Amazon SQS Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An AWS account with IAM permissions for SQS
- AWS Access Key ID and Secret Access Key

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Amazon SQS**
4. Enter your AWS credentials and region

### Using code

```ballerina
import ballerinax/aws.sqs;
```

```toml
[[dependency]]
org = "ballerinax"
name = "aws.sqs"
version = "4.1.1"
```

## AWS setup

### Create an IAM user

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to **IAM** > **Users** > **Create User**
3. Attach the `AmazonSQSFullAccess` policy (or a custom policy with required permissions)
4. Create an access key under the user's **Security credentials** tab
5. Record the **Access Key ID** and **Secret Access Key**

## Configuration

### Standard credentials

```ballerina
configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

sqs:Client sqsClient = check new ({
    region: sqs:US_EAST_1,
    auth: {
        accessKeyId,
        secretAccessKey
    }
});
```

### Profile-based authentication

```ballerina
sqs:Client sqsClient = check new ({
    region: sqs:US_EAST_1,
    auth: {
        profileName: "myAwsProfile",
        credentialsFilePath: "/path/to/credentials"
    }
});
```

### Available regions

Common region constants: `sqs:US_EAST_1`, `sqs:US_WEST_2`, `sqs:EU_WEST_1`, `sqs:AP_SOUTHEAST_1`.

### Config.toml

```toml
# Config.toml
accessKeyId = "AKIAIOSFODNN7EXAMPLE"
secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `InvalidClientTokenId` | Bad access key | Verify `accessKeyId` |
| `SignatureDoesNotMatch` | Bad secret key | Verify `secretAccessKey` |
| `AccessDenied` | Missing IAM permissions | Attach SQS policy to IAM user |
| `NonExistentQueue` | Queue does not exist | Create queue first or check URL |

## Next steps

- [Actions Reference](actions) -- Queue and message operations
- [Examples](examples) -- Code examples
