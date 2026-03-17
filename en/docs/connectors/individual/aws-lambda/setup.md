---
title: "AWS Lambda - Setup"
description: "How to set up and configure the ballerinax/aws.lambda connector."
---

# AWS Lambda Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An AWS account with Lambda permissions
- AWS CLI installed and configured
- AWS Access Key ID and Secret Access Key

## Step 1: Configure AWS IAM

Create an IAM role for Lambda execution and an IAM user for deployment.

### Lambda Execution Role

Create a role that Lambda assumes when executing your function:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

The trust policy for the role should allow Lambda to assume it:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"Service": "lambda.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }
    ]
}
```

### Deployment User Policy

The IAM user deploying Lambda functions needs:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "lambda:DeleteFunction",
                "lambda:GetFunction",
                "lambda:ListFunctions",
                "lambda:InvokeFunction",
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
```

## Step 2: Install the Connector

Add the import and dependency:

```ballerina
import ballerinax/aws.lambda;
```

```toml
[[dependency]]
org = "ballerinax"
name = "aws.lambda"
version = "3.3.0"
```

## Step 3: Write a Lambda Function

Create a Ballerina file with a Lambda function annotation:

```ballerina
import ballerinax/aws.lambda;

@aws.lambda:Function
public function hello(aws.lambda:Context ctx, json input) returns json|error {
    string name = (check input.name).toString();
    return {
        statusCode: 200,
        body: string `Hello, ${name}! Request ID: ${ctx.getRequestId()}`
    };
}
```

## Step 4: Build the Lambda Artifact

Build the project with the `--cloud=lambda` flag to generate the deployment package:

```bash
bal build --cloud=lambda
```

This generates a ZIP file in the `target/` directory ready for deployment.

## Step 5: Deploy to AWS

### Using AWS CLI

```bash
# Create the function
aws lambda create-function \
    --function-name hello-ballerina \
    --runtime provided.al2 \
    --handler hello.handler \
    --role arn:aws:iam::123456789012:role/lambda-execution-role \
    --zip-file fileb://target/aws-lambda.zip \
    --region us-east-1

# Update existing function code
aws lambda update-function-code \
    --function-name hello-ballerina \
    --zip-file fileb://target/aws-lambda.zip \
    --region us-east-1
```

### Test the Function

Invoke the function from the AWS CLI:

```bash
aws lambda invoke \
    --function-name hello-ballerina \
    --payload '{"name": "World"}' \
    --region us-east-1 \
    output.json

cat output.json
```

## Step 6: Configure API Gateway (Optional)

To expose your Lambda function as an HTTP endpoint:

1. Navigate to **API Gateway** in the AWS Console
2. Create a new **HTTP API**
3. Add a route (e.g., `POST /hello`)
4. Set the integration target to your Lambda function
5. Deploy the API to a stage

## Troubleshooting

| Issue | Solution |
|---|---|
| Build error with `--cloud=lambda` | Ensure the `aws.lambda` dependency is in `Ballerina.toml` |
| `InvalidParameterValueException` | Verify the IAM role ARN and handler name |
| Function timeout | Increase the timeout setting (default 3 seconds) |
| `ResourceNotFoundException` | Check the function name and region |
| Permission errors on invoke | Ensure the IAM user has `lambda:InvokeFunction` permission |

## Next Steps

- [Actions Reference](actions) -- Function annotations and context API
- [Examples](examples) -- Lambda function examples
