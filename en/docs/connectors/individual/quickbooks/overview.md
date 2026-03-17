---
title: "QuickBooks"
description: "Overview of the ballerinax/quickbooks.online connector for WSO2 Integrator."
---

# QuickBooks

| | |
|---|---|
| **Package** | [`ballerinax/quickbooks.online`](https://central.ballerina.io/ballerinax/quickbooks.online/latest) |
| **Version** | 1.5.1 |
| **Category** | E-Commerce & Finance |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/quickbooks.online/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/quickbooks.online/latest#functions) |

## Overview

QuickBooks Online is a cloud-based accounting and financial management platform developed by Intuit. The `ballerinax/quickbooks.online` connector enables WSO2 Integrator applications to interact with the [QuickBooks Online API v3](https://developer.intuit.com/app/developer/qbo/docs/get-started), providing access to invoicing, customer management, payments, and financial reporting capabilities.

The connector supports the following functional areas:

- **Invoicing** - Create, update, query, and manage invoices and credit memos
- **Customer Management** - Manage customer records and contact information
- **Payments** - Track and manage payment transactions
- **Items and Inventory** - Manage products, services, and inventory items
- **Financial Accounts** - Access chart of accounts and account balances
- **Reports** - Retrieve financial reports and summaries

## Key Capabilities

- **Invoice Lifecycle Management** - Create draft invoices, send them to customers, record payments, and track overdue invoices
- **Customer CRUD Operations** - Create, read, update, and delete customer records with full contact details
- **Payment Processing** - Record customer payments against outstanding invoices
- **Query Support** - Use QuickBooks query language to search and filter records across all entity types
- **Batch Operations** - Perform multiple operations in a single API call for efficiency
- **Real-time Financial Data** - Access up-to-date account balances, profit and loss, and balance sheet data

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "quickbooks.online"
version = "1.5.1"
```

Import and initialize the connector:

```ballerina
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;

online:Client quickbooks = check new ({
    serviceUrl: serviceUrl,
    auth: {
        token: token
    }
});
```

Create a simple invoice:

```ballerina
import ballerina/io;

json invoice = check quickbooks->post("/v3/company/<realmId>/invoice", {
    "Line": [
        {
            "Amount": 150.00,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "ItemRef": {"value": "1", "name": "Services"}
            }
        }
    ],
    "CustomerRef": {"value": "1"}
});

io:println("Invoice created: ", invoice);
```

## Use Cases

| Use Case | Description |
|---|---|
| Invoice Automation | Automatically generate and send invoices based on completed orders or service milestones |
| Customer Sync | Synchronize customer data between QuickBooks and CRM systems like Salesforce or HubSpot |
| Payment Reconciliation | Match incoming payments with outstanding invoices across multiple channels |
| Financial Reporting | Extract financial data for consolidated reporting and dashboards |
| Expense Tracking | Record and categorize business expenses from external procurement systems |
| Order-to-Cash Integration | Connect e-commerce platforms to QuickBooks for end-to-end order and payment processing |

## Related Resources

- [Setup Guide](setup) - Configure QuickBooks OAuth and API access
- [Actions Reference](actions) - Complete list of available operations
- [Examples](examples) - End-to-end code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/quickbooks.online/latest)
- [QuickBooks API Documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account)
