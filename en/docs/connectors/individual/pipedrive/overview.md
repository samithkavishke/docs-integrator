---
title: "Pipedrive"
description: "Overview of the ballerinax/pipedrive connector for WSO2 Integrator."
---

# Pipedrive

| | |
|---|---|
| **Package** | [`ballerinax/pipedrive`](https://central.ballerina.io/ballerinax/pipedrive/latest) |
| **Version** | 1.5.1 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/pipedrive/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/pipedrive/latest#functions) |

## Overview

Pipedrive is a sales-focused CRM platform designed to help sales teams manage leads, deals, and communications. The `ballerinax/pipedrive` connector enables WSO2 Integrator applications to interact with the Pipedrive REST API, providing access to deals, persons, organizations, activities, and pipeline management.

The connector supports:

- **Deals** - Create, update, search, and manage sales deals through pipeline stages
- **Persons** - Manage contact persons with phone, email, and custom fields
- **Organizations** - CRUD operations on company/organization records
- **Activities** - Schedule and track calls, meetings, tasks, and emails
- **Pipelines & Stages** - Manage sales pipelines and their stages

## Key Capabilities

| Capability | Description |
|---|---|
| Deal Management | Full lifecycle management of deals through pipeline stages |
| Contact Management | Create and manage persons and organizations |
| Activity Tracking | Schedule calls, meetings, and tasks linked to deals |
| Pipeline Analytics | Access deal flow and pipeline stage data |
| Search | Search across all entity types with filters |
| Custom Fields | Support for custom fields on all entity types |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "pipedrive"
version = "1.5.1"
```

```ballerina
import ballerinax/pipedrive;

configurable string apiToken = ?;

pipedrive:ConnectionConfig config = {
    auth: {
        token: apiToken
    }
};

pipedrive:Client pipedrive = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Lead-to-Deal Automation | Automatically create deals from inbound leads |
| Sales Activity Tracking | Log calls and meetings against deals and contacts |
| Pipeline Reporting | Extract pipeline metrics for external dashboards |
| CRM Synchronization | Sync contacts and deals with other business systems |
| Deal Stage Automation | Automatically advance deals based on external events |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Pipedrive API Documentation](https://developers.pipedrive.com/docs/api/v1)
