---
title: "Amazon DynamoDB - Setup"
description: "How to set up and configure the ballerinax/aws.dynamodb connector."
---

# Amazon DynamoDB Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.3.0 or later
- An AWS account with appropriate IAM permissions
- AWS Access Key ID and Secret Access Key

## Step 1: Configure AWS IAM

Create an IAM user or role with the required DynamoDB permissions. Below is a recommended IAM policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:ListTables",
                "dynamodb:UpdateTable",
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:BatchGetItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/*"
        }
    ]
}
```

For read-only access, limit actions to `GetItem`, `Query`, `Scan`, `BatchGetItem`, `DescribeTable`, and `ListTables`.

### Generate Access Keys

1. Navigate to the **IAM Console** in AWS
2. Select **Users** and choose your IAM user
3. Go to the **Security credentials** tab
4. Click **Create access key**
5. Save the **Access Key ID** and **Secret Access Key** securely

## Step 2: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Amazon DynamoDB**
4. Follow the connection wizard to enter credentials

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/aws.dynamodb;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "aws.dynamodb"
version = "2.3.0"
```

## Step 3: Configure Credentials

Define configurable variables and supply values through `Config.toml`:

```ballerina
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

dynamodb:ConnectionConfig dynamoConfig = {
    awsCredentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region
};

dynamodb:Client dynamoClient = check new (dynamoConfig);
```

```toml
# Config.toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
```

## Step 4: Verify the Setup

Test your connection with a simple table listing:

```ballerina
import ballerina/io;
import ballerinax/aws.dynamodb;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    dynamodb:Client dynamoClient = check new ({
        awsCredentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        },
        region: region
    });

    dynamodb:TableList tables = check dynamoClient->listTables();
    io:println("Connected successfully. Tables: ", tables.tableNames);
}
```

Run the integration:

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `UnrecognizedClientException` | Verify the access key in `Config.toml` |
| `AccessDeniedException` | Ensure the IAM policy grants the required DynamoDB actions |
| `ResourceNotFoundException` | Verify the table name and region are correct |
| `ValidationException` | Check that key schema and attribute types match the table definition |
| Connection timeout | Check network/firewall settings and AWS region endpoint availability |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
