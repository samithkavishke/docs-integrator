---
title: "Salesforce Trigger"
description: "Overview of the ballerinax/trigger.salesforce connector for WSO2 Integrator."
---

# Salesforce Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.salesforce`](https://central.ballerina.io/ballerinax/trigger.salesforce/latest) |
| **Version** | 0.10.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.salesforce/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.salesforce/latest#functions) |

## Overview

The `ballerinax/trigger.salesforce` package provides a listener that enables your Ballerina integration to react to Salesforce Streaming API events in real time. When objects such as Accounts, Contacts, Opportunities, or custom objects are created, updated, or deleted in Salesforce, the listener automatically receives and dispatches these change events.

### Key capabilities

- **Change Data Capture (CDC)**: Listen to create, update, delete, and undelete events for standard and custom objects
- **Platform Events**: Subscribe to custom platform events published in Salesforce
- **PushTopic events**: Receive notifications based on SOQL queries when records match criteria
- **Real-time streaming**: Low-latency event delivery via the Salesforce Streaming API (CometD/Bayeux)

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.salesforce"
version = "0.10.0"
```

```ballerina
import ballerinax/trigger.salesforce;
import ballerina/log;

configurable string username = ?;
configurable string password = ?;

listener salesforce:Listener sfListener = new ({
    username,
    password
});

service salesforce:RecordService on sfListener {
    remote function onCreate(salesforce:EventData payload) returns error? {
        log:printInfo("Record created", payload = payload);
    }

    remote function onUpdate(salesforce:EventData payload) returns error? {
        log:printInfo("Record updated", payload = payload);
    }

    remote function onDelete(salesforce:EventData payload) returns error? {
        log:printInfo("Record deleted", payload = payload);
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.salesforce/latest)
