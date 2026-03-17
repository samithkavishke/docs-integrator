---
title: "AWS Secrets Manager - Setup"
description: "How to set up and configure the ballerinax/aws.secretmanager connector."
---

# AWS Secrets Manager Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An AWS account with Secrets Manager access
- AWS Access Key ID and Secret Access Key

## Step 1: Configure AWS IAM

Create an IAM policy granting Secrets Manager permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:CreateSecret",
                "secretsmanager:GetSecretValue",
                "secretsmanager:PutSecretValue",
                "secretsmanager:UpdateSecret",
                "secretsmanager:DeleteSecret",
                "secretsmanager:ListSecrets",
                "secretsmanager:DescribeSecret",
                "secretsmanager:RotateSecret",
                "secretsmanager:TagResource",
                "secretsmanager:UntagResource"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:*"
        }
    ]
}
```

For read-only access, limit actions to `GetSecretValue`, `ListSecrets`, and `DescribeSecret`.

## Step 2: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **AWS Secrets Manager**
4. Follow the connection wizard to enter credentials

### Using Code

```ballerina
import ballerinax/aws.secretmanager;
```

```toml
[[dependency]]
org = "ballerinax"
name = "aws.secretmanager"
version = "0.4.0"
```

## Step 3: Configure Credentials

```ballerina
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});
```

```toml
# Config.toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
```

## Step 4: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    secretmanager:Client smClient = check new ({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });

    secretmanager:SecretList secrets = check smClient->listSecrets();
    io:println("Connected. Found secrets: ", secrets.secretList.length());
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `AccessDeniedException` | Ensure IAM policy includes required secretsmanager actions |
| `ResourceNotFoundException` | Verify the secret name or ARN and region |
| `DecryptionFailure` | Check KMS key permissions if using custom encryption |
| `InvalidParameterException` | Validate the secret name format (no spaces, valid characters) |
| `LimitExceededException` | You have hit the Secrets Manager service quota |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
