---
title: "Azure Functions"
description: "Overview of the ballerinax/azure.functions connector for WSO2 Integrator."
---

# Azure Functions

| | |
|---|---|
| **Package** | [`ballerinax/azure.functions`](https://central.ballerina.io/ballerinax/azure.functions/latest) |
| **Version** | 4.2.0 |
| **Category** | Cloud Services - Serverless |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure.functions/4.2.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure.functions/4.2.0#functions) |

## Overview

The `ballerinax/azure.functions` module provides an annotation-based Azure Functions extension for Ballerina, enabling you to deploy Ballerina code as serverless functions on Microsoft Azure. It uses Azure Functions custom handlers to execute Ballerina programs in response to various triggers such as HTTP requests, queue messages, blob storage events, timers, and Cosmos DB changes.

## Key Capabilities

- **HTTP Trigger and Output** -- Handle HTTP requests and return responses as serverless endpoints
- **Queue Trigger and Output** -- Process and publish messages from Azure Storage Queues
- **Blob Trigger, Input, and Output** -- React to blob storage changes, read and write blobs
- **Timer Trigger** -- Execute functions on a scheduled interval using CRON expressions
- **Cosmos DB Trigger, Input, and Output** -- Respond to Cosmos DB changes, read and write documents
- **Twilio Output Binding** -- Send SMS messages via Twilio from function triggers

## Use Cases

| Scenario | Description |
|---|---|
| Serverless APIs | Deploy REST APIs without managing infrastructure |
| Event Processing | React to blob uploads, queue messages, or database changes |
| Scheduled Jobs | Run periodic tasks using timer-triggered functions |
| Webhook Handlers | Process incoming webhooks from third-party services |
| Data Pipelines | Transform data between Azure services using function chains |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure.functions"
version = "4.2.0"
```

```ballerina
import ballerinax/azure.functions;

@functions:HTTPTrigger {authLevel: "anonymous"}
service /hello on new functions:HTTPListener() {
    resource function get .() returns string {
        return "Hello from Azure Functions!";
    }
}
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Azure Functions Runtime | 4.x |
| Java Runtime | Java 21 |
| Hosting OS | Windows (required for custom handlers) |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure Azure and deploy functions
- [Actions Reference](actions) -- All available triggers and bindings
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure.functions/4.2.0)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
