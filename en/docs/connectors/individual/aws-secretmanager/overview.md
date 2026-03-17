---
title: "AWS Secrets Manager"
description: "Overview of the ballerinax/aws.secretmanager connector for WSO2 Integrator."
---

# AWS Secrets Manager

| | |
|---|---|
| **Package** | [`ballerinax/aws.secretmanager`](https://central.ballerina.io/ballerinax/aws.secretmanager/latest) |
| **Version** | 0.4.0 |
| **Category** | Cloud Services - Security |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.secretmanager/0.4.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.secretmanager/0.4.0#functions) |

## Overview

The `ballerinax/aws.secretmanager` connector provides programmatic access to AWS Secrets Manager from WSO2 Integrator. AWS Secrets Manager helps you protect access to your applications, services, and IT resources by enabling you to rotate, manage, and retrieve database credentials, API keys, and other secrets throughout their lifecycle. This connector allows you to create, read, update, delete, and rotate secrets programmatically.

## Key Capabilities

- **Create Secrets** -- Store new secrets with optional encryption and tagging
- **Retrieve Secrets** -- Get secret values by name or ARN, with version support
- **Update Secrets** -- Modify secret values and metadata
- **Delete Secrets** -- Remove secrets with optional recovery window
- **List Secrets** -- Enumerate all secrets with filtering
- **Secret Rotation** -- Configure and trigger automatic secret rotation

## Use Cases

| Scenario | Description |
|---|---|
| Database Credential Management | Store and rotate database connection strings |
| API Key Storage | Securely store third-party API keys and tokens |
| Certificate Management | Store TLS certificates and private keys |
| Environment Configuration | Manage environment-specific secrets across deployments |
| Secrets Rotation | Automate credential rotation for compliance |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.secretmanager"
version = "0.4.0"
```

```ballerina
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

secretmanager:ConnectionConfig smConfig = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

secretmanager:Client smClient = check new (smConfig);
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| AWS Secrets Manager API | Latest |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/aws.secretmanager/0.4.0)
- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/)
