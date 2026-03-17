---
title: "AWS Lambda"
description: "Overview of the ballerinax/aws.lambda connector for WSO2 Integrator."
---

# AWS Lambda

| | |
|---|---|
| **Package** | [`ballerinax/aws.lambda`](https://central.ballerina.io/ballerinax/aws.lambda/latest) |
| **Version** | 3.3.0 |
| **Category** | Cloud Services - Serverless |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.lambda/3.3.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.lambda/3.3.0#functions) |

## Overview

The `ballerinax/aws.lambda` package enables you to write AWS Lambda functions in Ballerina and deploy them to AWS. Unlike typical connectors that act as clients, this package provides annotations and runtime support so you can author serverless functions using Ballerina and have them compiled and deployed as AWS Lambda functions. This makes WSO2 Integrator a powerful platform for building event-driven, serverless integration flows.

## Key Capabilities

- **Lambda Function Authoring** -- Write Lambda functions directly in Ballerina
- **Event Source Support** -- Handle API Gateway, S3, DynamoDB Streams, SQS, and other event sources
- **Automatic Packaging** -- The Ballerina compiler generates the Lambda deployment artifact (ZIP)
- **Native Ballerina Types** -- Use Ballerina records for request/response serialization
- **Context Access** -- Access Lambda execution context (request ID, function name, memory limit)

## Supported Event Sources

| Event Source | Description |
|---|---|
| API Gateway | HTTP request/response via API Gateway proxy integration |
| S3 Events | Respond to S3 bucket events (object created, deleted) |
| DynamoDB Streams | Process DynamoDB table change events |
| SQS Messages | Process messages from SQS queues |
| Custom Events | Handle custom JSON event payloads |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.lambda"
version = "3.3.0"
```

```ballerina
import ballerinax/aws.lambda;

@aws.lambda:Function
public function hello(aws.lambda:Context ctx, json input) returns json|error {
    return {message: "Hello from Ballerina Lambda!"};
}
```

Build and generate the Lambda artifact:

```bash
bal build --cloud=lambda
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| AWS Lambda Runtime | Custom runtime (provided.al2) |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure AWS environment and deploy
- [Actions Reference](actions) -- Function annotations and context API
- [Examples](examples) -- Complete Lambda function examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/aws.lambda/3.3.0)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
