---
title: "Salesforce"
description: "Overview of the ballerinax/salesforce connector for WSO2 Integrator."
---

# Salesforce

| | |
|---|---|
| **Package** | [`ballerinax/salesforce`](https://central.ballerina.io/ballerinax/salesforce/latest) |
| **Version** | 8.3.0 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/salesforce/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/salesforce/latest#functions) |

## Overview

Salesforce Sales Cloud is one of the leading Customer Relationship Management (CRM) platforms, provided by Salesforce Inc. The `ballerinax/salesforce` connector enables WSO2 Integrator applications to interact with Salesforce through multiple API protocols, allowing comprehensive CRM data management, querying, and real-time event listening.

The connector supports the following Salesforce APIs:

- **Salesforce v59.0 REST API** - Standard CRUD operations on sObjects, SOQL queries, and metadata operations
- **Salesforce v59.0 SOAP API** - Enterprise-grade operations with full sObject support
- **Salesforce v59.0 APEX REST API** - Custom Apex endpoint invocations
- **Salesforce v59.0 BULK API** - High-volume data operations for bulk inserts, updates, upserts, and deletes
- **Salesforce v59.0 BULK V2 API** - Next-generation bulk operations with simplified processing

## Key Capabilities

- **SOQL and SOSL Queries** - Execute Salesforce Object Query Language and Salesforce Object Search Language queries to retrieve records
- **sObject CRUD** - Create, read, update, and delete standard and custom Salesforce objects
- **Bulk Data Processing** - Handle large data volumes efficiently with Bulk API and Bulk V2 API support
- **Describe Operations** - Retrieve metadata about sObjects, fields, and organizational structure
- **Event Listening** - Subscribe to Change Data Capture events, Platform Events, and PushTopics using CometD
- **Apex REST Invocations** - Call custom Apex REST endpoints defined in your Salesforce org

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "salesforce"
version = "8.3.0"
```

Import and initialize the connector:

```ballerina
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

salesforce:ConnectionConfig sfConfig = {
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
};

salesforce:Client salesforce = check new (sfConfig);
```

Execute a SOQL query to retrieve accounts:

```ballerina
import ballerina/io;

stream<record {}, error?> queryResults = check salesforce->query(
    "SELECT Id, Name, Industry FROM Account WHERE Industry = 'Technology' LIMIT 10"
);

check queryResults.forEach(function(record {} rec) {
    io:println(rec);
});
```

## Use Cases

| Use Case | Description |
|---|---|
| CRM Data Synchronization | Sync contact, lead, and account data between Salesforce and other systems |
| Bulk Data Migration | Migrate large volumes of records using Bulk API operations |
| Real-time Event Processing | React to record changes via Change Data Capture events |
| Custom API Integration | Invoke custom Apex REST endpoints for business logic |
| Report and Dashboard Data | Query and extract reporting data using SOQL |
| Lead Management Automation | Automatically create and route leads based on external events |

## Related Resources

- [Setup Guide](setup) - Configure Salesforce Connected App and authentication
- [Actions Reference](actions) - Complete list of available operations
- [Examples](examples) - End-to-end code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/salesforce/latest)
- [Salesforce REST API Documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm)
