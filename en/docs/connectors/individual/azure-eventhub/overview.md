---
title: "Azure Event Hubs"
description: "Overview of the ballerinax/azure_eventhub connector for WSO2 Integrator."
---

# Azure Event Hubs

| | |
|---|---|
| **Package** | [`ballerinax/azure_eventhub`](https://central.ballerina.io/ballerinax/azure_eventhub/latest) |
| **Version** | 3.1.0 |
| **Category** | Cloud Services - Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure_eventhub/3.1.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure_eventhub/3.1.0#functions) |

## Overview

The `ballerinax/azure_eventhub` connector provides programmatic access to Azure Event Hubs from WSO2 Integrator. Azure Event Hubs is a big data streaming platform and event ingestion service capable of receiving and processing millions of events per second. This connector enables you to send events, manage consumer groups, and publish batches of events.

## Key Capabilities

- **Send Events** -- Publish single or batched events to an Event Hub
- **Partition Publishing** -- Send events to specific partitions using partition keys
- **Consumer Group Management** -- Create, list, and delete consumer groups
- **Event Hub Management** -- List and describe Event Hubs in a namespace
- **Batch Publishing** -- Send multiple events in a single request for throughput

## Use Cases

| Scenario | Description |
|---|---|
| Real-Time Analytics | Stream business events for real-time dashboards |
| IoT Telemetry | Ingest high-volume device telemetry data |
| Audit Logging | Publish audit trail events to a centralized stream |
| Event-Driven Architecture | Decouple services using event-based communication |
| Change Data Capture | Stream database change events for downstream processing |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure_eventhub"
version = "3.1.0"
```

```ballerina
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

eventhub:ConnectionConfig config = {
    sasKeyName: sasKeyName,
    sasKey: sasKey,
    resourceUri: resourceUri
};

eventhub:Client eventHubClient = check new (config);
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Azure Event Hubs API | Latest |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure_eventhub/3.1.0)
- [Azure Event Hubs Documentation](https://learn.microsoft.com/en-us/azure/event-hubs/)
