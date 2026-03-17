---
title: "Amazon DynamoDB"
description: "Overview of the ballerinax/aws.dynamodb connector for WSO2 Integrator."
---

# Amazon DynamoDB

| | |
|---|---|
| **Package** | [`ballerinax/aws.dynamodb`](https://central.ballerina.io/ballerinax/aws.dynamodb/latest) |
| **Version** | 2.3.0 |
| **Category** | Cloud Services - Database |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.dynamodb/2.3.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.dynamodb/2.3.0#functions) |
| **AWS API Version** | 20120810 |

## Overview

The `ballerinax/aws.dynamodb` connector provides programmatic access to Amazon DynamoDB, a fully managed NoSQL database service offering fast and predictable performance with seamless scalability. This connector enables you to create and manage tables, perform item CRUD operations, run queries and scans, and execute batch operations from WSO2 Integrator.

## Key Capabilities

- **Table Management** -- Create, describe, update, list, and delete DynamoDB tables
- **Item CRUD** -- Put, get, update, and delete individual items with conditional expressions
- **Query** -- Retrieve items using partition key and optional sort key conditions
- **Scan** -- Full table scans with filter expressions for ad-hoc data retrieval
- **Batch Operations** -- Batch write (put/delete) up to 25 items in a single request
- **Secondary Indexes** -- Query Global and Local Secondary Indexes

## Use Cases

| Scenario | Description |
|---|---|
| Session Management | Store and retrieve user sessions with fast key-value access |
| IoT Data Storage | Ingest high-volume sensor data with auto-scaling throughput |
| Order Tracking | Query orders by customer ID and date range |
| Configuration Store | Centralized configuration storage for distributed services |
| Event Logging | Append-only event logs with time-sorted access patterns |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.dynamodb"
version = "2.3.0"
```

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

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.3.0+ |
| Amazon DynamoDB API | 20120810 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/aws.dynamodb/2.3.0)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
