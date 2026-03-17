---
title: "Amazon SES - Setup"
description: "How to set up and configure the ballerinax/aws.ses connector."
---

# Amazon SES Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.3.0 or later
- An AWS account with SES access
- AWS Access Key ID and Secret Access Key
- At least one verified email address or domain in SES

## Step 1: Configure AWS IAM

Create an IAM user or role with the required SES permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "ses:SendTemplatedEmail",
                "ses:SendBulkTemplatedEmail",
                "ses:CreateTemplate",
                "ses:UpdateTemplate",
                "ses:DeleteTemplate",
                "ses:GetTemplate",
                "ses:ListTemplates",
                "ses:ListIdentities",
                "ses:VerifyEmailIdentity",
                "ses:DeleteIdentity",
                "ses:GetIdentityVerificationAttributes"
            ],
            "Resource": "*"
        }
    ]
}
```

For restricted sending, limit the `Resource` to specific verified identities:

```json
"Resource": "arn:aws:ses:us-east-1:123456789012:identity/noreply@example.com"
```

## Step 2: Verify Email Identities

Before sending emails, you must verify either the sender email address or the sender domain in the AWS SES console:

1. Navigate to **Amazon SES** in the AWS Console
2. Go to **Verified identities**
3. Click **Create identity**
4. Choose **Email address** or **Domain**
5. Complete the verification process

:::note
New SES accounts are placed in the **sandbox** environment, which restricts sending to verified email addresses only. Request production access to send to any recipient.
:::

## Step 3: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Amazon SES**
4. Follow the connection wizard to enter credentials

### Using Code

```ballerina
import ballerinax/aws.ses;
```

```toml
[[dependency]]
org = "ballerinax"
name = "aws.ses"
version = "2.1.0"
```

## Step 4: Configure Credentials

```ballerina
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

ses:ConnectionConfig sesConfig = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

ses:Client sesClient = check new (sesConfig);
```

```toml
# Config.toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
```

:::tip
SES is available in select AWS regions. Ensure your `region` matches a region where SES is enabled (e.g., `us-east-1`, `us-west-2`, `eu-west-1`).
:::

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    ses:Client sesClient = check new ({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });

    // List verified identities
    ses:Identity[] identities = check sesClient->listIdentities();
    io:println("Verified identities:");
    foreach ses:Identity identity in identities {
        io:println("  - ", identity);
    }
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `MessageRejected` | Sender email is not verified in SES |
| `AccessDenied` | IAM policy does not include required SES actions |
| Sandbox restrictions | Request production access in the SES console |
| `InvalidParameterValue` | Check email format and required fields |
| Emails not received | Check spam folders and SES sending statistics |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
