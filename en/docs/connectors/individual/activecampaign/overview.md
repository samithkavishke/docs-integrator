---
title: "ActiveCampaign"
description: "Overview of the ballerinax/activecampaign connector for WSO2 Integrator."
---

# ActiveCampaign

| | |
|---|---|
| **Package** | [`ballerinax/activecampaign`](https://central.ballerina.io/ballerinax/activecampaign/latest) |
| **Version** | 1.3.1 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/activecampaign/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/activecampaign/latest#functions) |

## Overview

ActiveCampaign is a customer experience automation platform combining email marketing, marketing automation, CRM, and sales automation. The `ballerinax/activecampaign` connector enables WSO2 Integrator applications to interact with the ActiveCampaign API v3, managing contacts, automations, deals, and campaign data.

The connector supports:

- **Contacts** - Create, update, search, and manage contacts with custom fields and tags
- **Automations** - Trigger and manage marketing automation workflows
- **Deals** - CRM deal management through pipeline stages
- **Lists** - Manage contact lists and subscriptions
- **Tags** - Organize contacts with tags for segmentation

## Key Capabilities

| Capability | Description |
|---|---|
| Contact Management | Full CRUD operations on contacts with custom fields |
| Automation Triggers | Add contacts to automations programmatically |
| Deal Pipeline | Manage CRM deals and pipeline stages |
| Tag Management | Apply and remove tags for contact segmentation |
| List Subscriptions | Manage contact list memberships |
| Event Tracking | Track custom events for automation triggers |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "activecampaign"
version = "1.3.1"
```

```ballerina
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

activecampaign:ConnectionConfig config = {
    baseUrl: apiUrl,
    auth: {
        token: apiKey
    }
};

activecampaign:Client activeCampaign = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Lead Nurturing | Automatically add contacts to nurturing automations |
| Customer Onboarding | Trigger onboarding sequences from external events |
| Contact Sync | Synchronize contacts between systems with tags and custom fields |
| Sales Automation | Create deals and move them through pipeline stages |
| Event-Driven Marketing | Track events and trigger targeted campaigns |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [ActiveCampaign API Documentation](https://developers.activecampaign.com/reference/overview)
