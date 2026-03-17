---
title: "Xero"
description: "Overview of the ballerinax/xero.accounts connector for WSO2 Integrator."
---

# Xero

| | |
|---|---|
| **Package** | [`ballerinax/xero.accounts`](https://central.ballerina.io/ballerinax/xero.accounts/latest) |
| **Version** | 1.5.1 |
| **Category** | E-Commerce & Finance |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/xero.accounts/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/xero.accounts/latest#functions) |

## Overview

Xero is a cloud-based accounting platform designed for small and medium-sized businesses. The `ballerinax/xero.accounts` connector enables WSO2 Integrator applications to interact with the [Xero Accounting API](https://developer.xero.com/documentation/api/accounting/overview), providing capabilities for managing invoices, contacts, bank transactions, payments, and financial reporting.

The connector supports the following functional areas:

- **Invoicing** - Create, update, query, and manage sales and purchase invoices
- **Contacts** - Manage customer and supplier contact records
- **Bank Transactions** - Record and reconcile bank transactions
- **Payments** - Process and track payments against invoices
- **Accounts** - Manage chart of accounts and account codes
- **Credit Notes** - Create and apply credit notes to invoices

## Key Capabilities

- **Multi-tenant Support** - Connect to multiple Xero organizations with a single OAuth 2.0 app
- **Invoice Lifecycle Management** - Draft, approve, send, and void invoices with full audit trail
- **Bank Reconciliation** - Create bank transactions and reconcile them with statement lines
- **Contact Management** - Full CRUD operations on customer and supplier records with grouping
- **Financial Reporting** - Access trial balance, profit and loss, and balance sheet data
- **Attachment Support** - Upload and manage file attachments on invoices and other entities

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "xero.accounts"
version = "1.5.1"
```

Import and initialize the connector:

```ballerina
import ballerinax/xero.accounts;

configurable string token = ?;

accounts:Client xero = check new ({
    auth: {
        token: token
    }
});
```

Query invoices from a Xero organization:

```ballerina
import ballerina/io;

accounts:Invoices invoices = check xero->getInvoices(
    xeroTenantId = "<tenant-id>"
);

io:println("Total invoices: ", invoices?.Invoices?.length());
```

## Use Cases

| Use Case | Description |
|---|---|
| Invoice Automation | Automatically create and send invoices from order management or project tracking systems |
| Contact Synchronization | Sync customer and supplier data between Xero and CRM platforms |
| Bank Reconciliation | Automate bank feed reconciliation by matching transactions with invoices |
| Multi-org Consolidation | Aggregate financial data across multiple Xero organizations for group reporting |
| Expense Processing | Record purchase invoices and bills from procurement or expense management systems |
| Payment Tracking | Automate payment recording and status updates across connected systems |

## Related Resources

- [Setup Guide](setup) - Configure Xero OAuth 2.0 and API access
- [Actions Reference](actions) - Complete list of available operations
- [Examples](examples) - End-to-end code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/xero.accounts/latest)
- [Xero API Documentation](https://developer.xero.com/documentation/api/accounting/overview)
