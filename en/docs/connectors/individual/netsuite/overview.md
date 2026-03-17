---
title: "Oracle NetSuite"
description: "Overview of the ballerinax/netsuite connector for WSO2 Integrator."
---

# Oracle NetSuite

| | |
|---|---|
| **Package** | [`ballerinax/netsuite`](https://central.ballerina.io/ballerinax/netsuite/latest) |
| **Version** | 3.3.0 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/netsuite/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/netsuite/latest#functions) |

## Overview

Oracle NetSuite is a cloud-based Enterprise Resource Planning (ERP) system that provides financial management, CRM, e-commerce, and other business functionality. The `ballerinax/netsuite` connector enables WSO2 Integrator applications to interact with NetSuite through the SuiteTalk Web Services API, providing full access to NetSuite record types and operations.

The connector supports:

- **Record CRUD** - Create, read, update, delete, and upsert standard and custom NetSuite records
- **Search** - Execute saved searches and custom search queries across record types
- **SuiteQL** - Query NetSuite data using the SuiteQL query language
- **Record Types** - Work with customers, vendors, invoices, sales orders, inventory items, and more
- **Custom Records** - Full support for custom record types and custom fields

## Key Capabilities

| Capability | Description |
|---|---|
| Record Management | Full CRUD on all standard and custom record types |
| SuiteQL Queries | SQL-like queries for flexible data retrieval |
| Search Operations | Execute saved searches and build complex search criteria |
| Sublist Operations | Manage line items on transactions and records |
| Custom Fields | Read and write custom fields on any record type |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "netsuite"
version = "3.3.0"
```

```ballerina
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

netsuite:ConnectionConfig nsConfig = {
    accountId: accountId,
    consumerId: consumerId,
    consumerSecret: consumerSecret,
    token: token,
    tokenSecret: tokenSecret
};

netsuite:Client netsuite = check new (nsConfig);
```

## Use Cases

| Use Case | Description |
|---|---|
| Order-to-Cash | Automate sales order creation and invoice generation |
| Procure-to-Pay | Manage vendor bills, purchase orders, and payments |
| Inventory Sync | Synchronize inventory levels with external e-commerce platforms |
| Financial Integration | Extract GL entries and financial data for reporting |
| Customer Master Data | Sync customer records across systems |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [NetSuite SuiteTalk Documentation](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_N3261975.html)
