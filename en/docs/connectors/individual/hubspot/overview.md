---
title: "HubSpot CRM"
description: "Overview of the ballerinax/hubspot.crm.contact connector for WSO2 Integrator."
---

# HubSpot CRM

| | |
|---|---|
| **Package** | [`ballerinax/hubspot.crm.contact`](https://central.ballerina.io/ballerinax/hubspot.crm.contact/latest) |
| **Version** | 2.3.1 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/hubspot.crm.contact/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/hubspot.crm.contact/latest#functions) |

## Overview

HubSpot is a leading inbound marketing, sales, and customer service platform that helps businesses attract, engage, and delight customers. The `ballerinax/hubspot.crm.contact` connector enables WSO2 Integrator applications to interact with the HubSpot CRM Contacts API V3, providing comprehensive contact management capabilities.

The connector supports:

- **Contact CRUD** - Create, read, update, and archive CRM contacts with full property support
- **Batch Operations** - Efficiently process multiple contacts in a single API call
- **Search** - Find contacts using filters, property values, and query strings
- **Associations** - Link contacts to companies, deals, tickets, and other CRM objects
- **Merge** - Programmatically merge duplicate contact records

## Key Capabilities

| Capability | Description |
|---|---|
| Contact Lifecycle Management | Full CRUD operations with standard and custom properties |
| Advanced Search | Filter contacts using multiple criteria, operators, and sorting |
| Batch Processing | Create, update, or retrieve multiple contacts per request |
| Association Management | Create relationships between contacts and other objects |
| Merge Contacts | Deduplicate by merging contact records |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "hubspot.crm.contact"
version = "2.3.1"
```

```ballerina
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

contact:ConnectionConfig config = {
    auth: {
        token: accessToken
    }
};

contact:Client hubspot = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Lead Capture | Create contacts from web forms, email, or third-party sources |
| Contact Sync | Synchronize data between HubSpot and external CRM or ERP systems |
| Data Enrichment | Update contact properties with data from external APIs |
| Deduplication | Search for and merge duplicate contact records |
| Marketing Segmentation | Manage contact properties for campaign segmentation |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [HubSpot CRM API Documentation](https://developers.hubspot.com/docs/api/crm/contacts)
