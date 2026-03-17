---
title: "Amazon S3 - Setup"
description: "How to set up and configure the ballerinax/aws.s3 connector."
---

# Amazon S3 Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An AWS account with appropriate IAM permissions
- AWS Access Key ID and Secret Access Key

## Step 1: Configure AWS IAM

Create an IAM user or role with the required S3 permissions. Below is a recommended IAM policy for common S3 operations:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:ListBucket",
                "s3:ListAllMyBuckets",
                "s3:GetBucketLocation",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:CopyObject",
                "s3:ListMultipartUploadParts",
                "s3:AbortMultipartUpload",
                "s3:PutObjectAcl",
                "s3:GetObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

For broader access across all buckets, replace the `Resource` value with `"arn:aws:s3:::*"`.

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
3. Search for **Amazon S3**
4. Follow the connection wizard to enter credentials

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/aws.s3;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "aws.s3"
version = "3.5.1"
```

## Step 3: Configure Credentials

Define configurable variables in your Ballerina code and supply values through `Config.toml`:

```ballerina
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

s3:ConnectionConfig s3Config = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

s3:Client s3Client = check new (s3Config);
```

Create or update `Config.toml` in your project root:

```toml
# Config.toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
```

### Supported AWS Regions

Common region identifiers include:

| Region | Identifier |
|---|---|
| US East (N. Virginia) | `us-east-1` |
| US West (Oregon) | `us-west-2` |
| EU (Ireland) | `eu-west-1` |
| EU (Frankfurt) | `eu-central-1` |
| Asia Pacific (Singapore) | `ap-southeast-1` |
| Asia Pacific (Sydney) | `ap-southeast-2` |

## Step 4: Verify the Setup

Test your connection with a simple bucket listing:

```ballerina
import ballerina/io;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

public function main() returns error? {
    s3:ConnectionConfig s3Config = {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    };

    s3:Client s3Client = check new (s3Config);

    s3:Bucket[] buckets = check s3Client->listBuckets();
    io:println("Successfully connected. Found ", buckets.length(), " buckets.");
    foreach s3:Bucket bucket in buckets {
        io:println("  - ", bucket.name);
    }
}
```

Run the integration:

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `InvalidAccessKeyId` | Verify the access key in `Config.toml` is correct |
| `SignatureDoesNotMatch` | Check that the secret access key has no extra whitespace |
| `AccessDenied` | Ensure the IAM policy grants the required S3 actions |
| `NoSuchBucket` | Verify the bucket name and region match |
| Connection timeout | Check network/firewall settings and AWS region endpoint availability |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
